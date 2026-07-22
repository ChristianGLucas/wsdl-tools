import { WsdlInput, NamespacesResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseWsdlDocument } from './lib/wsdl';
import { toNamespaceDecl } from './lib/shape';

/**
 * Extract every xmlns declaration on the document's root element
 * (prefix -> URI, "" prefix for the default namespace) plus the declared
 * targetNamespace.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function listNamespaces(ax: AxiomContext, input: WsdlInput): NamespacesResult {
  const result = parseWsdlDocument(input.getWsdl());
  const out = new NamespacesResult();
  if (result.ok === false) {
    out.setError(result.error.message);
    return out;
  }
  out.setNamespacesList(result.model.namespaces.map(toNamespaceDecl));
  out.setTargetNamespace(result.model.targetNamespace);
  return out;
}
