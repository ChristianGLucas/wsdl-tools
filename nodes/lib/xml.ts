// Generic, namespace-aware XML tree helpers built on fast-xml-parser (MIT,
// NaturalIntelligence). fast-xml-parser owns the hard part (real XML
// tokenizing/parsing, including refusing external entities outright — see
// the security note below); this file only shapes its generic object output
// into something WSDL-shaped code can walk without hardcoding a document's
// specific namespace prefixes (real WSDL documents use whatever prefixes
// their author chose — "wsdl", "s", "tns", no prefix at all, etc).
//
// Security note: fast-xml-parser does not resolve external entities or DTDs
// at all — it throws ("External entities are not supported") rather than
// silently inlining file/network content, so parsing here is XXE-safe by
// construction. We surface that throw as a structured error (see wsdl.ts)
// instead of letting it crash the node. checkDepth() in guard.ts additionally
// bounds nesting depth before the raw text ever reaches the parser.

import { XMLParser, XMLValidator } from 'fast-xml-parser';

export type XmlNode = Record<string, unknown>;

export function buildParser(): XMLParser {
  return new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    allowBooleanAttributes: true,
    // Keep every value a raw string — WSDL attributes (minOccurs, maxOccurs,
    // soapAction, etc.) are meaningful as text; we never want the parser
    // silently coercing "1" to a number or "true" to a boolean underneath us.
    parseTagValue: false,
    parseAttributeValue: false,
    trimValues: true,
    removeNSPrefix: false,
  });
}

export interface XmlParseError {
  code: string;
  message: string;
}

export type XmlParseResult = { ok: true; node: XmlNode } | { ok: false; error: XmlParseError };

/**
 * Validate, then parse, an XML document. Returns a structured error for
 * malformed XML or an XML construct fast-xml-parser refuses to process
 * (e.g. external/DOCTYPE entities).
 */
export function parseXml(xml: string): XmlParseResult {
  const validation = XMLValidator.validate(xml, { allowBooleanAttributes: true });
  if (validation !== true) {
    return {
      ok: false,
      error: {
        code: 'XML_PARSE_ERROR',
        message: `Malformed XML: ${validation.err.msg} (line ${validation.err.line ?? '?'}).`,
      },
    };
  }
  try {
    return { ok: true, node: buildParser().parse(xml) as XmlNode };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return { ok: false, error: { code: 'XML_UNSAFE_ENTITY', message } };
  }
}

/** Strip a namespace prefix off a tag/attribute name: "soap:address" -> "address". */
export function localName(qualified: string): string {
  const i = qualified.indexOf(':');
  return i === -1 ? qualified : qualified.slice(i + 1);
}

/** The namespace prefix of a tag name, or "" for the (unprefixed) default namespace. */
export function prefixOf(qualified: string): string {
  const i = qualified.indexOf(':');
  return i === -1 ? '' : qualified.slice(0, i);
}

/**
 * Every direct child element of `node` whose LOCAL name (namespace prefix
 * stripped) equals `name`, in document order, each normalized to an object
 * (fast-xml-parser gives a bare string/empty object for an element with no
 * children/attributes of its own — normalized to {} so attr() below is safe).
 * Matching by local name, not exact prefixed name, is what lets this walk
 * documents regardless of which prefix their author chose for the WSDL/SOAP/
 * XSD namespaces (including no prefix at all, via a default xmlns).
 */
export function children(node: XmlNode | undefined | null, name: string): XmlNode[] {
  if (!node || typeof node !== 'object') return [];
  const out: XmlNode[] = [];
  for (const key of Object.keys(node)) {
    if (key.startsWith('@_') || key === '#text' || key.startsWith('#comment')) continue;
    if (localName(key) !== name) continue;
    const val = (node as Record<string, unknown>)[key];
    const arr = Array.isArray(val) ? val : [val];
    for (const v of arr) {
      if (v !== null && typeof v === 'object') out.push(v as XmlNode);
      else out.push({});
    }
  }
  return out;
}

/** First direct child element matching a local name, or undefined. */
export function child(node: XmlNode | undefined | null, name: string): XmlNode | undefined {
  return children(node, name)[0];
}

/** Any of several local names, first match wins per element encountered (order = names[] priority). */
export function childOfAny(node: XmlNode | undefined | null, names: string[]): XmlNode | undefined {
  for (const n of names) {
    const c = child(node, n);
    if (c) return c;
  }
  return undefined;
}

/** An attribute's string value (unprefixed attribute name), or "" if absent. */
export function attr(node: XmlNode | undefined | null, name: string, fallback = ''): string {
  if (!node) return fallback;
  const v = (node as Record<string, unknown>)['@_' + name];
  if (v === undefined || v === null) return fallback;
  return String(v);
}

/**
 * Resolve the namespace URI bound to `prefix` at `node`, checking `node`'s
 * own xmlns declarations first (a local override) and falling back to
 * `rootNamespaces` (the document root's declarations — where virtually all
 * real-world WSDL declares every prefix it uses). `prefix === ""` looks up
 * the default namespace (a bare `xmlns="..."` declaration).
 */
export function resolveNamespace(
  node: XmlNode | undefined,
  prefix: string,
  rootNamespaces: Record<string, string>
): string {
  const attrName = prefix ? '@_xmlns:' + prefix : '@_xmlns';
  const local = node ? (node as Record<string, unknown>)[attrName] : undefined;
  if (typeof local === 'string') return local;
  return rootNamespaces[prefix] ?? '';
}

/** Every xmlns declaration on `node`'s own attributes, as {prefix, uri} pairs. */
export function namespaceDecls(node: XmlNode | undefined): { prefix: string; uri: string }[] {
  if (!node) return [];
  const out: { prefix: string; uri: string }[] = [];
  for (const key of Object.keys(node)) {
    if (!key.startsWith('@_xmlns')) continue;
    const uri = (node as Record<string, unknown>)[key];
    if (typeof uri !== 'string') continue;
    if (key === '@_xmlns') {
      out.push({ prefix: '', uri });
    } else if (key.startsWith('@_xmlns:')) {
      out.push({ prefix: key.slice('@_xmlns:'.length), uri });
    }
  }
  return out;
}

/** Strip a namespace prefix off a QName reference value: "tns:GetPriceRequest" -> "GetPriceRequest". */
export function localPart(qname: string): string {
  const i = qname.indexOf(':');
  return i === -1 ? qname : qname.slice(i + 1);
}
