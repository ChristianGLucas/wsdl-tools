import { WsdlInput } from '../gen/messages_pb';
import { detectWsdlVersion } from './detect_wsdl_version';
import { testContext } from './lib/test_context';
import { STOCK_QUOTE_WSDL, WSDL2_SAMPLE, NOT_WSDL_XML, MALFORMED_XML } from './lib/fixtures';

function makeInput(wsdl: string): WsdlInput {
  const i = new WsdlInput();
  i.setWsdl(wsdl);
  return i;
}

describe('DetectWsdlVersion', () => {
  it('classifies a WSDL 1.1 document', () => {
    const out = detectWsdlVersion(testContext, makeInput(STOCK_QUOTE_WSDL));
    expect(out.getVersion()).toBe('1.1');
    expect(out.getRootElement()).toBe('wsdl:definitions');
    expect(out.getNamespaceUri()).toBe('http://schemas.xmlsoap.org/wsdl/');
    expect(out.getError()).toBe('');
  });

  it('classifies a WSDL 2.0 document with a default (unprefixed) namespace root', () => {
    const out = detectWsdlVersion(testContext, makeInput(WSDL2_SAMPLE));
    expect(out.getVersion()).toBe('2.0');
    expect(out.getRootElement()).toBe('description');
    expect(out.getNamespaceUri()).toBe('http://www.w3.org/ns/wsdl');
  });

  it('reports "unknown" (not an error) with the actual root element for a non-WSDL document', () => {
    const out = detectWsdlVersion(testContext, makeInput(NOT_WSDL_XML));
    expect(out.getVersion()).toBe('unknown');
    expect(out.getRootElement()).toBe('foo');
    expect(out.getError()).toBe('');
  });

  it('returns a structured error for malformed XML', () => {
    const out = detectWsdlVersion(testContext, makeInput(MALFORMED_XML));
    expect(out.getVersion()).toBe('unknown');
    expect(out.getError()).not.toBe('');
  });
});
