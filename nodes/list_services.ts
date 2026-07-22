import { WsdlInput, ServicesResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseWsdlDocument } from './lib/wsdl';
import { toServiceInfo } from './lib/shape';

/**
 * List every <service> (WSDL 1.1) / service (2.0) declared, each with its
 * full list of ports/endpoints (port name, binding it implements, and the
 * concrete soap:address/soap12:address location URL).
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function listServices(ax: AxiomContext, input: WsdlInput): ServicesResult {
  const result = parseWsdlDocument(input.getWsdl());
  const out = new ServicesResult();
  if (result.ok === false) {
    out.setError(result.error.message);
    return out;
  }
  out.setVersion(result.model.version);
  out.setServicesList(result.model.services.map(toServiceInfo));
  return out;
}
