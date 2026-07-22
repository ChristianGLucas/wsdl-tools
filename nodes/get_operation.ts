import { GetOperationInput, OperationDetail } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseWsdlDocument, WsdlModel } from './lib/wsdl';
import { localPart } from './lib/xml';

/**
 * Look up one operation by name and return its full detail: owning
 * portType, input/output/fault messages, and — if a binding in the
 * document binds this operation to SOAP — its soapAction and document/rpc
 * style. Pass port_type_name to disambiguate when more than one portType
 * declares an operation with the same name. found=false and a structured
 * error when no operation matches.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function getOperation(ax: AxiomContext, input: GetOperationInput): OperationDetail {
  const out = new OperationDetail();
  out.setName(input.getOperationName());

  const result = parseWsdlDocument(input.getWsdl());
  if (result.ok === false) {
    out.setError(result.error.message);
    return out;
  }
  const model: WsdlModel = result.model;
  const portTypeName = input.getPortTypeName();
  const operationName = input.getOperationName();

  if (!operationName) {
    out.setError('operation_name must not be empty.');
    return out;
  }

  const candidatePortTypes = portTypeName
    ? model.portTypes.filter((pt) => pt.name === portTypeName || localPart(pt.name) === localPart(portTypeName))
    : model.portTypes;

  const matches: { portTypeName: string; op: (typeof candidatePortTypes)[number]['operations'][number] }[] = [];
  for (const pt of candidatePortTypes) {
    for (const op of pt.operations) {
      if (op.name === operationName) matches.push({ portTypeName: pt.name, op });
    }
  }

  if (matches.length === 0) {
    out.setError(`No operation named "${operationName}" found${portTypeName ? ` on portType "${portTypeName}"` : ''}.`);
    return out;
  }
  if (matches.length > 1) {
    out.setError(
      `Operation "${operationName}" is ambiguous — found on ${matches.length} portTypes (${matches
        .map((m) => m.portTypeName)
        .join(', ')}). Disambiguate with port_type_name.`
    );
    return out;
  }

  const { portTypeName: matchedPortType, op } = matches[0];
  out.setFound(true);
  out.setPortTypeName(matchedPortType);
  out.setInputMessage(op.inputMessage);
  out.setOutputMessage(op.outputMessage);
  out.setFaultMessagesList(op.faultMessages);

  const binding = model.bindings.find((b) => localPart(b.type) === localPart(matchedPortType));
  const bindingOp = binding?.operations.find((o) => o.name === operationName);
  if (bindingOp) {
    out.setSoapAction(bindingOp.soapAction);
    out.setStyle(bindingOp.style);
  }

  return out;
}
