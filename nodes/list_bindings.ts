import { WsdlInput, BindingsResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseWsdlDocument } from './lib/wsdl';
import { toBindingInfo } from './lib/shape';

/**
 * List every <binding>: the portType/interface it implements, its SOAP
 * transport URI, its default document/rpc style, its SOAP version (1.1 vs
 * 1.2, detected from which binding extension namespace is used), and its
 * per-operation soapAction/style overrides. A binding with no
 * soap:binding/soap12:binding element (e.g. an HTTP or MIME binding)
 * reports soap_version="".
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function listBindings(ax: AxiomContext, input: WsdlInput): BindingsResult {
  const result = parseWsdlDocument(input.getWsdl());
  const out = new BindingsResult();
  if (result.ok === false) {
    out.setError(result.error.message);
    return out;
  }
  out.setBindingsList(result.model.bindings.map(toBindingInfo));
  return out;
}
