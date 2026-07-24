// WSDL 1.1 (https://www.w3.org/TR/wsdl) and WSDL 2.0 (https://www.w3.org/TR/wsdl20)
// semantic model, built on top of the generic namespace-aware XML helpers in
// xml.ts. fast-xml-parser owns XML tokenizing/parsing (and XXE-safety); this
// file owns WSDL-schema knowledge — which elements/attributes mean what —
// per the deliberate choice to not depend on a SOAP-client library (this
// package only ever parses a document, it never places a call).
//
// Scope: WSDL 1.1 is supported in full structural depth (the overwhelmingly
// common real-world case for enterprise SOAP). WSDL 2.0 is supported
// structurally for its analogous constructs (description/interface/binding/
// service/endpoint) but does not attempt every WSDL 2.0 extension (e.g.
// non-SOAP bindings, WSDL 2.0's separate fault/multipart-related extension
// namespaces). Embedded XSD <types> extraction is structural (top-level
// elements/complexTypes only) — a nested/anonymous type is not recursively
// expanded; use a dedicated XSD tool for deep schema analysis.

import { checkDepth, checkEmpty } from './guard';
import { attr, child, childOfAny, children, localName, localPart, namespaceDecls, parseXml, prefixOf, resolveNamespace, XmlNode } from './xml';

// Genuine stack-overflow guard (not a payload-size cap): fast-xml-parser
// builds its tree recursively, so pathologically deep nesting can exhaust
// the call stack. Kept for that reason even though byte-size limits are
// otherwise the platform's job, not this node's.
export const MAX_NESTING_DEPTH = 300;

export const WSDL1_NS = 'http://schemas.xmlsoap.org/wsdl/';
export const WSDL2_NS = 'http://www.w3.org/ns/wsdl';
export const SOAP11_BINDING_NS = 'http://schemas.xmlsoap.org/wsdl/soap/';
export const SOAP12_BINDING_NS = 'http://schemas.xmlsoap.org/wsdl/soap12/';
export const WSDL2_SOAP_BINDING_NS = 'http://www.w3.org/ns/wsdl/soap';

export interface WsdlError {
  code: string;
  message: string;
}

export interface ModelPort {
  name: string;
  binding: string; // raw QName reference as written (may be prefixed)
  addressLocation: string;
  transport: string;
}

export interface ModelService {
  name: string;
  ports: ModelPort[];
}

export interface ModelBindingOperation {
  name: string;
  soapAction: string;
  style: string;
}

export interface ModelBinding {
  name: string;
  type: string; // raw QName reference to the portType/interface
  transport: string;
  style: string;
  soapVersion: string; // "1.1" | "1.2" | ""
  operations: ModelBindingOperation[];
}

export interface ModelOperation {
  name: string;
  inputMessage: string;
  outputMessage: string;
  faultMessages: string[];
}

export interface ModelPortType {
  name: string;
  operations: ModelOperation[];
}

export interface ModelMessagePart {
  name: string;
  element: string;
  type: string;
}

export interface ModelMessage {
  name: string;
  parts: ModelMessagePart[];
}

export interface ModelXsdField {
  name: string;
  type: string;
  minOccurs: string;
  maxOccurs: string;
}

export interface ModelXsdComplexType {
  name: string;
  fields: ModelXsdField[];
}

export interface ModelXsdElement {
  name: string;
  type: string;
}

export interface ModelImport {
  namespace: string;
  location: string;
  kind: 'wsdl_import' | 'xsd_import' | 'xsd_include';
}

export interface WsdlModel {
  version: '1.1' | '2.0' | 'unknown';
  rootElement: string;
  namespaceUri: string;
  targetNamespace: string;
  namespaces: { prefix: string; uri: string }[];
  services: ModelService[];
  bindings: ModelBinding[];
  portTypes: ModelPortType[];
  messages: ModelMessage[];
  typesTargetNamespace: string;
  typesElements: ModelXsdElement[];
  typesComplexTypes: ModelXsdComplexType[];
  imports: ModelImport[];
}

export type ParseWsdlResult = { ok: true; model: WsdlModel } | { ok: false; error: WsdlError };

function classifySoapBinding(
  ext: XmlNode | undefined,
  extKey: string | undefined,
  rootNamespaces: Record<string, string>
): { soapVersion: string; transport: string; style: string } {
  if (!ext || !extKey) return { soapVersion: '', transport: '', style: '' };
  const uri = resolveNamespace(ext, prefixOf(extKey), rootNamespaces);
  if (uri === SOAP11_BINDING_NS) {
    return { soapVersion: '1.1', transport: attr(ext, 'transport'), style: attr(ext, 'style', 'document') };
  }
  if (uri === SOAP12_BINDING_NS) {
    return { soapVersion: '1.2', transport: attr(ext, 'transport'), style: attr(ext, 'style', 'document') };
  }
  return { soapVersion: '', transport: '', style: '' };
}

/** Find the extension child (e.g. soap:binding among a binding's children) with its own tag key, so we can resolve its namespace prefix. */
function findExtensionChild(node: XmlNode, localTagName: string): { el: XmlNode; key: string } | undefined {
  for (const key of Object.keys(node)) {
    if (key.startsWith('@_') || key === '#text') continue;
    if (localName(key) !== localTagName) continue;
    const val = (node as Record<string, unknown>)[key];
    const first = Array.isArray(val) ? val[0] : val;
    if (first !== null && typeof first === 'object') return { el: first as XmlNode, key };
  }
  return undefined;
}

function parseTypesSection(definitions: XmlNode, docTargetNamespace: string): {
  typesTargetNamespace: string;
  elements: ModelXsdElement[];
  complexTypes: ModelXsdComplexType[];
} {
  const elements: ModelXsdElement[] = [];
  const complexTypes: ModelXsdComplexType[] = [];
  let typesTargetNamespace = '';

  for (const typesEl of children(definitions, 'types')) {
    for (const schema of children(typesEl, 'schema')) {
      if (!typesTargetNamespace) {
        typesTargetNamespace = attr(schema, 'targetNamespace');
      }
      for (const el of children(schema, 'element')) {
        elements.push({ name: attr(el, 'name'), type: attr(el, 'type') });
      }
      for (const ct of children(schema, 'complexType')) {
        const container = childOfAny(ct, ['sequence', 'all', 'choice']);
        const fields: ModelXsdField[] = [];
        if (container) {
          for (const f of children(container, 'element')) {
            fields.push({
              name: attr(f, 'name') || localPart(attr(f, 'ref')),
              type: attr(f, 'type') || attr(f, 'ref'),
              minOccurs: attr(f, 'minOccurs', '1'),
              maxOccurs: attr(f, 'maxOccurs', '1'),
            });
          }
        }
        complexTypes.push({ name: attr(ct, 'name'), fields });
      }
    }
  }

  return { typesTargetNamespace: typesTargetNamespace || docTargetNamespace, elements, complexTypes };
}

function parseImports(definitions: XmlNode): ModelImport[] {
  const imports: ModelImport[] = [];
  for (const imp of children(definitions, 'import')) {
    imports.push({ namespace: attr(imp, 'namespace'), location: attr(imp, 'location'), kind: 'wsdl_import' });
  }
  for (const typesEl of children(definitions, 'types')) {
    for (const schema of children(typesEl, 'schema')) {
      for (const imp of children(schema, 'import')) {
        imports.push({ namespace: attr(imp, 'namespace'), location: attr(imp, 'schemaLocation'), kind: 'xsd_import' });
      }
      for (const inc of children(schema, 'include')) {
        imports.push({ namespace: '', location: attr(inc, 'schemaLocation'), kind: 'xsd_include' });
      }
    }
  }
  return imports;
}

function parseMessages(definitions: XmlNode): ModelMessage[] {
  return children(definitions, 'message').map((m) => ({
    name: attr(m, 'name'),
    parts: children(m, 'part').map((p) => ({
      name: attr(p, 'name'),
      element: attr(p, 'element'),
      type: attr(p, 'type'),
    })),
  }));
}

function parsePortTypes(definitions: XmlNode, version: '1.1' | '2.0'): ModelPortType[] {
  const tagName = version === '2.0' ? 'interface' : 'portType';
  return children(definitions, tagName).map((pt) => ({
    name: attr(pt, 'name'),
    operations: children(pt, 'operation').map((op) => {
      const input = child(op, 'input');
      const output = child(op, 'output');
      const faults = children(op, 'fault');
      return {
        name: attr(op, 'name'),
        // WSDL 1.1: input/output carry a `message` QName ref.
        // WSDL 2.0: interface operation input/output carry an `element` QName ref instead (no separate message construct).
        inputMessage: input ? attr(input, 'message') || attr(input, 'element') : '',
        outputMessage: output ? attr(output, 'message') || attr(output, 'element') : '',
        faultMessages: faults.map((f) => attr(f, 'message') || attr(f, 'element')),
      };
    }),
  }));
}

function parseBindings(
  definitions: XmlNode,
  version: '1.1' | '2.0',
  rootNamespaces: Record<string, string>
): ModelBinding[] {
  return children(definitions, 'binding').map((b) => {
    const soapExt = findExtensionChild(b, 'binding');
    const { soapVersion, transport, style } = classifySoapBinding(soapExt?.el, soapExt?.key, rootNamespaces);

    const operations: ModelBindingOperation[] = children(b, 'operation').map((op) => {
      const opExt = findExtensionChild(op, 'operation');
      let soapAction = '';
      let opStyle = style;
      if (opExt) {
        const uri = resolveNamespace(opExt.el, prefixOf(opExt.key), rootNamespaces);
        if (uri === SOAP11_BINDING_NS || uri === SOAP12_BINDING_NS) {
          soapAction = attr(opExt.el, 'soapAction');
          opStyle = attr(opExt.el, 'style', style);
        }
      }
      // WSDL 1.1 binding operations are matched to their portType operation by
      // `name`. WSDL 2.0 binding operations instead carry a `ref` QName
      // pointing at the interface operation — there is no `name` attribute at
      // all. Normalize both to a bare operation name so downstream matching
      // (GetOperation/ResolveOperationEndpoint) is version-agnostic.
      const opName = version === '2.0' ? localPart(attr(op, 'ref')) : attr(op, 'name');
      return { name: opName, soapAction, style: opStyle };
    });

    // WSDL 1.1 <binding> declares the portType it implements via `type`. WSDL
    // 2.0 <binding> instead uses a SEPARATE `interface` attribute for that —
    // its own `type` attribute means something else entirely (the protocol/
    // extension URI, e.g. "http://www.w3.org/ns/wsdl/soap"), not an interface
    // reference, so it must never be used as a fallback here: doing so would
    // silently return the protocol URI as if it were the interface name.
    // Read the version-correct attribute so binding-to-portType/interface
    // resolution (ValidateWsdl's cross-reference check, GetOperation,
    // ResolveOperationEndpoint) works for both versions instead of silently
    // failing — or silently returning the wrong string — on every WSDL 2.0
    // document.
    const implementedType = version === '2.0' ? attr(b, 'interface') : attr(b, 'type');

    return {
      name: attr(b, 'name'),
      type: implementedType,
      transport,
      style,
      soapVersion,
      operations,
    };
  });
}

function parseServices(
  definitions: XmlNode,
  version: '1.1' | '2.0',
  bindings: ModelBinding[],
  rootNamespaces: Record<string, string>
): ModelService[] {
  const portTag = version === '2.0' ? 'endpoint' : 'port';
  const bindingByLocalName = new Map(bindings.map((b) => [localPart(b.name) || b.name, b]));

  return children(definitions, 'service').map((svc) => ({
    name: attr(svc, 'name'),
    ports: children(svc, portTag).map((port) => {
      const bindingRef = attr(port, 'binding');
      const matchedBinding = bindingByLocalName.get(localPart(bindingRef));

      let addressLocation = '';
      if (version === '2.0') {
        addressLocation = attr(port, 'address');
      } else {
        const addrExt = findExtensionChild(port, 'address');
        if (addrExt) {
          const uri = resolveNamespace(addrExt.el, prefixOf(addrExt.key), rootNamespaces);
          if (uri === SOAP11_BINDING_NS || uri === SOAP12_BINDING_NS) {
            addressLocation = attr(addrExt.el, 'location');
          }
        }
      }

      return {
        name: attr(port, 'name'),
        binding: bindingRef,
        addressLocation,
        transport: matchedBinding?.transport ?? '',
      };
    }),
  }));
}

export interface RootInfo {
  rootKey: string;
  rootLocal: string;
  root: XmlNode;
  namespaces: { prefix: string; uri: string }[];
  rootNamespaces: Record<string, string>;
  namespaceUri: string;
  targetNamespace: string;
  version: '1.1' | '2.0' | 'unknown';
}

export interface WsdlErrorResult {
  ok: false;
  error: WsdlError;
}

export interface RootInfoOkResult {
  ok: true;
  info: RootInfo;
}

export type ParseRootInfoResult = RootInfoOkResult | WsdlErrorResult;

export interface DetectVersionOkResult {
  ok: true;
  version: '1.1' | '2.0' | 'unknown';
  rootElement: string;
  namespaceUri: string;
}

export type DetectWsdlVersionResult = DetectVersionOkResult | WsdlErrorResult;

/**
 * Guard, parse, and classify the document's root element — shared by
 * detectWsdlVersion() (which stops here) and parseWsdlDocument() (which
 * continues into the full semantic extraction below). Cheap: no per-section
 * (services/bindings/portTypes/...) walking happens here.
 */
export function parseRootInfo(xml: string): ParseRootInfoResult {
  const emptyErr = checkEmpty(xml, 'wsdl');
  if (emptyErr) return { ok: false, error: emptyErr };

  const depthErr = checkDepth(xml, MAX_NESTING_DEPTH, 'wsdl');
  if (depthErr) return { ok: false, error: depthErr };

  const parseResult = parseXml(xml);
  if (parseResult.ok === false) return { ok: false, error: parseResult.error };
  const parsed = parseResult.node;

  const rootKeys = Object.keys(parsed).filter((k) => k !== '?xml' && !k.startsWith('#'));
  if (rootKeys.length === 0) {
    return { ok: false, error: { code: 'EMPTY_DOCUMENT', message: 'No root element found.' } };
  }
  if (rootKeys.length > 1) {
    return {
      ok: false,
      error: { code: 'MULTIPLE_ROOT_ELEMENTS', message: `Expected a single root element, found: ${rootKeys.join(', ')}.` },
    };
  }

  const rootKey = rootKeys[0];
  const root = parsed[rootKey] as XmlNode;
  const rootLocal = localName(rootKey);
  const rootPrefix = prefixOf(rootKey);

  const namespaces = namespaceDecls(root);
  const rootNamespaces: Record<string, string> = {};
  for (const { prefix, uri } of namespaces) rootNamespaces[prefix] = uri;

  const namespaceUri = rootPrefix ? rootNamespaces[rootPrefix] ?? '' : rootNamespaces[''] ?? '';
  const targetNamespace = attr(root, 'targetNamespace');

  let version: '1.1' | '2.0' | 'unknown';
  if (rootLocal === 'definitions') {
    version = '1.1';
  } else if (rootLocal === 'description') {
    version = '2.0';
  } else {
    version = 'unknown';
  }

  return {
    ok: true,
    info: { rootKey, rootLocal, root, namespaces, rootNamespaces, namespaceUri, targetNamespace, version },
  };
}

/**
 * Cheap version/root classification only — does not walk services, bindings,
 * portTypes, messages, or types. version is "unknown" (not an error) when the
 * document is valid XML but not rooted at a recognized WSDL element; the
 * caller still gets the actual root element name back.
 */
export function detectWsdlVersion(xml: string): DetectWsdlVersionResult {
  const result = parseRootInfo(xml);
  if (result.ok === false) return result;
  return { ok: true, version: result.info.version, rootElement: result.info.rootKey, namespaceUri: result.info.namespaceUri };
}

/**
 * Parse raw WSDL text into a normalized WsdlModel, or a structured error.
 * Applies size/depth guards before any XML parsing, then dispatches to
 * version-aware WSDL 1.1 / 2.0 extraction. Never fetches anything — imports
 * are reported, not resolved.
 */
export function parseWsdlDocument(xml: string): ParseWsdlResult {
  const rootResult = parseRootInfo(xml);
  if (rootResult.ok === false) return { ok: false, error: rootResult.error };
  const { root, rootKey, namespaces, rootNamespaces, namespaceUri, targetNamespace, version } = rootResult.info;

  if (version === 'unknown') {
    return {
      ok: false,
      error: {
        code: 'NOT_WSDL_ROOT',
        message: `Expected root element <definitions> (WSDL 1.1) or <description> (WSDL 2.0), found <${rootKey}>.`,
      },
    };
  }

  const { typesTargetNamespace, elements, complexTypes } = parseTypesSection(root, targetNamespace);
  const messages = version === '1.1' ? parseMessages(root) : [];
  const portTypes = parsePortTypes(root, version);
  const bindings = parseBindings(root, version, rootNamespaces);
  const services = parseServices(root, version, bindings, rootNamespaces);
  const imports = parseImports(root);

  const model: WsdlModel = {
    version,
    rootElement: rootKey,
    namespaceUri,
    targetNamespace,
    namespaces,
    services,
    bindings,
    portTypes,
    messages,
    typesTargetNamespace,
    typesElements: elements,
    typesComplexTypes: complexTypes,
    imports,
  };

  return { ok: true, model };
}
