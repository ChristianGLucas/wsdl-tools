import { WsdlInput, WsdlSummary } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseWsdlDocument } from './lib/wsdl';

/**
 * Document-wide counts in one call: detected version, target namespace,
 * and counts of services, ports, bindings, portTypes, operations,
 * messages, complexTypes, elements, and imports. The fast "what am I
 * looking at" check before deciding which detail node to call next.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function summarizeWsdl(ax: AxiomContext, input: WsdlInput): WsdlSummary {
  const result = parseWsdlDocument(input.getWsdl());
  const out = new WsdlSummary();
  if (result.ok === false) {
    out.setError(result.error.message);
    return out;
  }
  const m = result.model;
  out.setVersion(m.version);
  out.setTargetNamespace(m.targetNamespace);
  out.setServiceCount(m.services.length);
  out.setPortCount(m.services.reduce((n, s) => n + s.ports.length, 0));
  out.setBindingCount(m.bindings.length);
  out.setPortTypeCount(m.portTypes.length);
  out.setOperationCount(m.portTypes.reduce((n, pt) => n + pt.operations.length, 0));
  out.setMessageCount(m.messages.length);
  out.setComplexTypeCount(m.typesComplexTypes.length);
  out.setElementCount(m.typesElements.length);
  out.setImportCount(m.imports.length);
  return out;
}
