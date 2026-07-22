import { WsdlInput, EndpointsResult, Endpoint } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseWsdlDocument } from './lib/wsdl';

/**
 * List every service endpoint in the document as one flat inventory —
 * service name, port name, binding, address location, and transport for
 * each — rather than grouped by service. The quick "what SOAP URLs does
 * this document declare" view.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function listEndpoints(ax: AxiomContext, input: WsdlInput): EndpointsResult {
  const result = parseWsdlDocument(input.getWsdl());
  const out = new EndpointsResult();
  if (result.ok === false) {
    out.setError(result.error.message);
    return out;
  }
  const endpoints: Endpoint[] = [];
  for (const svc of result.model.services) {
    for (const port of svc.ports) {
      const e = new Endpoint();
      e.setServiceName(svc.name);
      e.setPortName(port.name);
      e.setBinding(port.binding);
      e.setAddressLocation(port.addressLocation);
      e.setTransport(port.transport);
      endpoints.push(e);
    }
  }
  out.setEndpointsList(endpoints);
  return out;
}
