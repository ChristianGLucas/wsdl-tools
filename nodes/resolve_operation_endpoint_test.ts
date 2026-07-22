import { ResolveOperationEndpointInput } from '../gen/messages_pb';
import { resolveOperationEndpoint } from './resolve_operation_endpoint';
import { testContext } from './lib/test_context';
import { STOCK_QUOTE_WSDL } from './lib/fixtures';

function makeInput(wsdl: string, operationName: string, serviceName = '', portName = ''): ResolveOperationEndpointInput {
  const i = new ResolveOperationEndpointInput();
  i.setWsdl(wsdl);
  i.setOperationName(operationName);
  i.setServiceName(serviceName);
  i.setPortName(portName);
  return i;
}

describe('ResolveOperationEndpoint', () => {
  it('reports ambiguity (found=false) when an operation resolves to more than one endpoint', () => {
    // Both the SOAP 1.1 and SOAP 1.2 ports implement GetLastTradePrice.
    const out = resolveOperationEndpoint(testContext, makeInput(STOCK_QUOTE_WSDL, 'GetLastTradePrice'));
    expect(out.getFound()).toBe(false);
    expect(out.getError()).toMatch(/2 endpoints/);
  });

  it('resolves to the SOAP 1.1 port when disambiguated by port_name', () => {
    const out = resolveOperationEndpoint(testContext, makeInput(STOCK_QUOTE_WSDL, 'GetLastTradePrice', '', 'StockQuoteSoapPort'));
    expect(out.getFound()).toBe(true);
    expect(out.getServiceName()).toBe('StockQuoteService');
    expect(out.getPortName()).toBe('StockQuoteSoapPort');
    expect(out.getBindingName()).toBe('StockQuoteSoapBinding');
    expect(out.getPortTypeName()).toBe('StockQuotePortType');
    expect(out.getAddressLocation()).toBe('http://example.com/stockquote11');
    expect(out.getTransport()).toBe('http://schemas.xmlsoap.org/soap/http');
    expect(out.getSoapAction()).toBe('http://example.com/GetLastTradePrice');
    expect(out.getStyle()).toBe('document');
  });

  it('resolves to the SOAP 1.2 port when disambiguated by the other port_name', () => {
    const out = resolveOperationEndpoint(testContext, makeInput(STOCK_QUOTE_WSDL, 'GetLastTradePrice', '', 'StockQuoteSoap12Port'));
    expect(out.getFound()).toBe(true);
    expect(out.getAddressLocation()).toBe('http://example.com/stockquote12');
    expect(out.getSoapAction()).toBe('http://example.com/GetLastTradePrice12');
  });

  it('resolves the input-only operation too, given a service_name filter', () => {
    const out = resolveOperationEndpoint(testContext, makeInput(STOCK_QUOTE_WSDL, 'SubscribeToPrice', 'StockQuoteService', 'StockQuoteSoapPort'));
    expect(out.getFound()).toBe(true);
    expect(out.getSoapAction()).toBe('http://example.com/SubscribeToPrice');
  });

  it('returns found=false with a structured error for an operation that does not exist', () => {
    const out = resolveOperationEndpoint(testContext, makeInput(STOCK_QUOTE_WSDL, 'NoSuchOp'));
    expect(out.getFound()).toBe(false);
    expect(out.getError()).not.toBe('');
  });
});
