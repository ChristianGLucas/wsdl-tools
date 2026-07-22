import { WsdlInput } from '../gen/messages_pb';
import { listServices } from './list_services';
import { testContext } from './lib/test_context';
import { STOCK_QUOTE_WSDL } from './lib/fixtures';

function makeInput(wsdl: string): WsdlInput {
  const i = new WsdlInput();
  i.setWsdl(wsdl);
  return i;
}

describe('ListServices', () => {
  it('lists the one service and both its ports with resolved transport', () => {
    const out = listServices(testContext, makeInput(STOCK_QUOTE_WSDL));
    expect(out.getError()).toBe('');
    expect(out.getVersion()).toBe('1.1');
    expect(out.getServicesList().length).toBe(1);
    const svc = out.getServicesList()[0];
    expect(svc.getName()).toBe('StockQuoteService');
    expect(svc.getPortsList().length).toBe(2);
    const names = svc.getPortsList().map((p) => p.getName()).sort();
    expect(names).toEqual(['StockQuoteSoap12Port', 'StockQuoteSoapPort']);
    const soap11 = svc.getPortsList().find((p) => p.getName() === 'StockQuoteSoapPort')!;
    expect(soap11.getAddressLocation()).toBe('http://example.com/stockquote11');
    expect(soap11.getTransport()).toBe('http://schemas.xmlsoap.org/soap/http');
  });

  it('returns an empty services list with a structured error for a non-WSDL document', () => {
    const out = listServices(testContext, makeInput('<not-wsdl/>'));
    expect(out.getServicesList().length).toBe(0);
    expect(out.getError()).not.toBe('');
  });
});
