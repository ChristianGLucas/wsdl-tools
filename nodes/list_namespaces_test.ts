import { WsdlInput } from '../gen/messages_pb';
import { listNamespaces } from './list_namespaces';
import { testContext } from './lib/test_context';
import { STOCK_QUOTE_WSDL, WSDL2_SAMPLE } from './lib/fixtures';

function makeInput(wsdl: string): WsdlInput {
  const i = new WsdlInput();
  i.setWsdl(wsdl);
  return i;
}

describe('ListNamespaces', () => {
  it('extracts all 6 declared namespace prefixes plus the target namespace', () => {
    const out = listNamespaces(testContext, makeInput(STOCK_QUOTE_WSDL));
    expect(out.getError()).toBe('');
    expect(out.getTargetNamespace()).toBe('http://example.com/stockquote.wsdl');
    expect(out.getNamespacesList().length).toBe(6);
    const map = new Map(out.getNamespacesList().map((n) => [n.getPrefix(), n.getUri()]));
    expect(map.get('tns')).toBe('http://example.com/stockquote.wsdl');
    expect(map.get('soap')).toBe('http://schemas.xmlsoap.org/wsdl/soap/');
    expect(map.get('soap12')).toBe('http://schemas.xmlsoap.org/wsdl/soap12/');
  });

  it('extracts the default (unprefixed) namespace as prefix=""', () => {
    const out = listNamespaces(testContext, makeInput(WSDL2_SAMPLE));
    const defaultNs = out.getNamespacesList().find((n) => n.getPrefix() === '');
    expect(defaultNs).toBeDefined();
    expect(defaultNs!.getUri()).toBe('http://www.w3.org/ns/wsdl');
  });
});
