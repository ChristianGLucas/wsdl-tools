import { WsdlInput, PortTypesResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseWsdlDocument } from './lib/wsdl';
import { toPortTypeInfo } from './lib/shape';

/**
 * List every portType (WSDL 1.1) / interface (2.0) declared, each with its
 * operations (name, input message, output message, fault messages) as
 * declared on the abstract interface, before consulting any binding.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function listPortTypes(ax: AxiomContext, input: WsdlInput): PortTypesResult {
  const result = parseWsdlDocument(input.getWsdl());
  const out = new PortTypesResult();
  if (result.ok === false) {
    out.setError(result.error.message);
    return out;
  }
  out.setPortTypesList(result.model.portTypes.map(toPortTypeInfo));
  return out;
}
