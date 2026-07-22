import { WsdlInput } from '../gen/messages_pb';
import { listEndpoints } from './list_endpoints';
import { testContext } from './lib/test_context';
import { STOCK_QUOTE_WSDL } from './lib/fixtures';

function makeInput(wsdl: string): WsdlInput {
  const i = new WsdlInput();
  i.setWsdl(wsdl);
  return i;
}

describe('ListEndpoints', () => {
  it('flattens both ports into one endpoint inventory', () => {
    const out = listEndpoints(testContext, makeInput(STOCK_QUOTE_WSDL));
    expect(out.getError()).toBe('');
    expect(out.getEndpointsList().length).toBe(2);
    for (const e of out.getEndpointsList()) {
      expect(e.getServiceName()).toBe('StockQuoteService');
    }
    const soap12 = out.getEndpointsList().find((e) => e.getPortName() === 'StockQuoteSoap12Port')!;
    expect(soap12.getAddressLocation()).toBe('http://example.com/stockquote12');
    expect(soap12.getTransport()).toBe('http://schemas.xmlsoap.org/soap12/http');
    expect(soap12.getBinding()).toBe('tns:StockQuoteSoap12Binding');
  });

  it('returns an empty list with a structured error for malformed input', () => {
    const out = listEndpoints(testContext, makeInput('<unclosed'));
    expect(out.getEndpointsList().length).toBe(0);
    expect(out.getError()).not.toBe('');
  });
});
