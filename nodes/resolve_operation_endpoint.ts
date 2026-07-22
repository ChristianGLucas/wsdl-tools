import { ResolveOperationEndpointInput, ResolvedEndpoint } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseWsdlDocument } from './lib/wsdl';
import { localPart } from './lib/xml';

interface Candidate {
  portTypeName: string;
  bindingName: string;
  serviceName: string;
  portName: string;
  addressLocation: string;
  transport: string;
  soapAction: string;
  style: string;
}

/**
 * Resolve one named operation all the way to its concrete, callable SOAP
 * endpoint: portType/interface operation -> the binding that implements it
 * -> a service port using that binding -> that port's address URL. Returns
 * soapAction and style alongside the address. The composability node — the
 * answer to "where do I actually send this call". Disambiguate with
 * service_name/port_name when more than one service or port resolves.
 * found=false and a structured error when the operation, its binding, or a
 * port for it cannot be resolved.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function resolveOperationEndpoint(ax: AxiomContext, input: ResolveOperationEndpointInput): ResolvedEndpoint {
  const out = new ResolvedEndpoint();
  const operationName = input.getOperationName();
  out.setOperationName(operationName);

  const result = parseWsdlDocument(input.getWsdl());
  if (result.ok === false) {
    out.setError(result.error.message);
    return out;
  }
  if (!operationName) {
    out.setError('operation_name must not be empty.');
    return out;
  }
  const model = result.model;
  const wantService = input.getServiceName();
  const wantPort = input.getPortName();

  const candidates: Candidate[] = [];
  for (const pt of model.portTypes) {
    const op = pt.operations.find((o) => o.name === operationName);
    if (!op) continue;
    for (const binding of model.bindings) {
      if (localPart(binding.type) !== localPart(pt.name)) continue;
      const bindingOp = binding.operations.find((o) => o.name === operationName);
      for (const svc of model.services) {
        if (wantService && svc.name !== wantService) continue;
        for (const port of svc.ports) {
          if (localPart(port.binding) !== localPart(binding.name)) continue;
          if (wantPort && port.name !== wantPort) continue;
          candidates.push({
            portTypeName: pt.name,
            bindingName: binding.name,
            serviceName: svc.name,
            portName: port.name,
            addressLocation: port.addressLocation,
            transport: port.transport,
            soapAction: bindingOp?.soapAction ?? '',
            style: bindingOp?.style ?? binding.style,
          });
        }
      }
    }
  }

  if (candidates.length === 0) {
    out.setError(
      `Could not resolve operation "${operationName}" to any endpoint (no matching portType+binding+service port combination found).`
    );
    return out;
  }
  if (candidates.length > 1) {
    out.setError(
      `Operation "${operationName}" resolves to ${candidates.length} endpoints (${candidates
        .map((c) => `${c.serviceName}.${c.portName}`)
        .join(', ')}). Disambiguate with service_name/port_name.`
    );
    return out;
  }

  const c = candidates[0];
  out.setFound(true);
  out.setPortTypeName(c.portTypeName);
  out.setBindingName(c.bindingName);
  out.setServiceName(c.serviceName);
  out.setPortName(c.portName);
  out.setAddressLocation(c.addressLocation);
  out.setTransport(c.transport);
  out.setSoapAction(c.soapAction);
  out.setStyle(c.style);
  return out;
}
