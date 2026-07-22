import { WsdlInput, ImportsResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseWsdlDocument } from './lib/wsdl';
import { toImportDecl } from './lib/shape';

/**
 * Extract every <import> (WSDL-level) and <xsd:import>/<xsd:include>
 * (schema-level) reference declared in the document: namespace and
 * location, verbatim as written. Locations are reported only — this node
 * never fetches them.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function listImports(ax: AxiomContext, input: WsdlInput): ImportsResult {
  const result = parseWsdlDocument(input.getWsdl());
  const out = new ImportsResult();
  if (result.ok === false) {
    out.setError(result.error.message);
    return out;
  }
  out.setImportsList(result.model.imports.map(toImportDecl));
  return out;
}
