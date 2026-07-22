import { WsdlInput, WsdlDocument } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseWsdlDocument } from './lib/wsdl';
import { toBindingInfo, toImportDecl, toMessageInfo, toNamespaceDecl, toPortTypeInfo, toServiceInfo, toXsdComplexType, toXsdElement } from './lib/shape';

/**
 * Parse a full WSDL 1.1 or 2.0 document into one structured representation
 * in a single call: detected version, target namespace, declared
 * namespaces, services (with ports/endpoint addresses), bindings,
 * portTypes/interfaces (with operations), the abstract messages, the
 * inline XSD types section's elements and complexTypes, and import/include
 * references. The general-purpose parse every other node in this package is
 * a cheaper, specialized view of. A document that isn't rooted at
 * wsdl:definitions (1.1) or wsdl20:description (2.0) returns a structured
 * error naming the actual root element.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function parseWsdl(ax: AxiomContext, input: WsdlInput): WsdlDocument {
  const result = parseWsdlDocument(input.getWsdl());
  const out = new WsdlDocument();
  if (result.ok === false) {
    out.setError(result.error.message);
    return out;
  }
  const { model } = result;
  out.setVersion(model.version);
  out.setTargetNamespace(model.targetNamespace);
  out.setNamespacesList(model.namespaces.map(toNamespaceDecl));
  out.setServicesList(model.services.map(toServiceInfo));
  out.setBindingsList(model.bindings.map(toBindingInfo));
  out.setPortTypesList(model.portTypes.map(toPortTypeInfo));
  out.setMessagesList(model.messages.map(toMessageInfo));
  out.setTypesElementsList(model.typesElements.map(toXsdElement));
  out.setTypesComplexTypesList(model.typesComplexTypes.map(toXsdComplexType));
  out.setImportsList(model.imports.map(toImportDecl));
  return out;
}
