import { WsdlInput, MessagesResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseWsdlDocument } from './lib/wsdl';
import { toMessageInfo } from './lib/shape';

/**
 * List every WSDL 1.1 abstract <message> and its <part> elements (each
 * part's name plus its element or type reference). WSDL 2.0 documents
 * reference XSD elements directly on interface operations instead of using
 * a separate message construct, so this returns an empty list for 2.0
 * documents (not an error).
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function listMessages(ax: AxiomContext, input: WsdlInput): MessagesResult {
  const result = parseWsdlDocument(input.getWsdl());
  const out = new MessagesResult();
  if (result.ok === false) {
    out.setError(result.error.message);
    return out;
  }
  out.setMessagesList(result.model.messages.map(toMessageInfo));
  return out;
}
