import { WsdlInput, OperationsResult, OperationInventoryItem } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseWsdlDocument } from './lib/wsdl';

/**
 * List every operation across the whole document — the "what can this
 * service do" inventory: name, owning portType, input/output message, and
 * whether it declares any fault messages.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function listOperations(ax: AxiomContext, input: WsdlInput): OperationsResult {
  const result = parseWsdlDocument(input.getWsdl());
  const out = new OperationsResult();
  if (result.ok === false) {
    out.setError(result.error.message);
    return out;
  }
  const items: OperationInventoryItem[] = [];
  for (const pt of result.model.portTypes) {
    for (const op of pt.operations) {
      const item = new OperationInventoryItem();
      item.setName(op.name);
      item.setPortTypeName(pt.name);
      item.setInputMessage(op.inputMessage);
      item.setOutputMessage(op.outputMessage);
      item.setHasFaults(op.faultMessages.length > 0);
      items.push(item);
    }
  }
  out.setOperationsList(items);
  return out;
}
