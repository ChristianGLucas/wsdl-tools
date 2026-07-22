import { WsdlInput, WsdlVersionResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { detectWsdlVersion as detect } from './lib/wsdl';

/**
 * Classify a document as WSDL 1.1, WSDL 2.0, or unknown, by its root
 * element and namespace URI, without parsing the rest of the document.
 * The cheap dispatch check before calling a version-specific reader.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function detectWsdlVersion(ax: AxiomContext, input: WsdlInput): WsdlVersionResult {
  const result = detect(input.getWsdl());
  const out = new WsdlVersionResult();
  if (result.ok === false) {
    out.setVersion('unknown');
    out.setError(result.error.message);
    return out;
  }
  out.setVersion(result.version);
  out.setRootElement(result.rootElement);
  out.setNamespaceUri(result.namespaceUri);
  return out;
}
