import { WsdlInput } from '../gen/messages_pb';
import { listBindings } from './list_bindings';
import { testContext } from './lib/test_context';
import { STOCK_QUOTE_WSDL } from './lib/fixtures';

function makeInput(wsdl: string): WsdlInput {
  const i = new WsdlInput();
  i.setWsdl(wsdl);
  return i;
}

describe('ListBindings', () => {
  it('distinguishes the SOAP 1.1 and SOAP 1.2 bindings by their extension namespace', () => {
    const out = listBindings(testContext, makeInput(STOCK_QUOTE_WSDL));
    expect(out.getError()).toBe('');
    expect(out.getBindingsList().length).toBe(2);

    const b11 = out.getBindingsList().find((b) => b.getName() === 'StockQuoteSoapBinding')!;
    expect(b11.getType()).toBe('tns:StockQuotePortType');
    expect(b11.getSoapVersion()).toBe('1.1');
    expect(b11.getTransport()).toBe('http://schemas.xmlsoap.org/soap/http');
    expect(b11.getStyle()).toBe('document');
    expect(b11.getOperationsList().length).toBe(2);
    expect(b11.getOperationsList().find((o) => o.getName() === 'SubscribeToPrice')!.getSoapAction()).toBe(
      'http://example.com/SubscribeToPrice'
    );

    const b12 = out.getBindingsList().find((b) => b.getName() === 'StockQuoteSoap12Binding')!;
    expect(b12.getSoapVersion()).toBe('1.2');
    expect(b12.getTransport()).toBe('http://schemas.xmlsoap.org/soap12/http');
    expect(b12.getOperationsList().find((o) => o.getName() === 'GetLastTradePrice')!.getSoapAction()).toBe(
      'http://example.com/GetLastTradePrice12'
    );
  });

  it('reports soap_version="" for a binding with no soap:binding/soap12:binding extension', () => {
    const wsdl = `<wsdl:definitions xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/" xmlns:tns="urn:x">
      <wsdl:binding name="PlainBinding" type="tns:SomePortType"></wsdl:binding>
    </wsdl:definitions>`;
    const out = listBindings(testContext, makeInput(wsdl));
    expect(out.getBindingsList().length).toBe(1);
    expect(out.getBindingsList()[0].getSoapVersion()).toBe('');
    expect(out.getBindingsList()[0].getTransport()).toBe('');
  });
});
