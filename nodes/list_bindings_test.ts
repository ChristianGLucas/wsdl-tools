import { WsdlInput } from '../gen/messages_pb';
import { listBindings } from './list_bindings';
import { testContext } from './lib/test_context';
import { STOCK_QUOTE_WSDL, WSDL2_SAMPLE } from './lib/fixtures';

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

  it('reads the WSDL 2.0 `interface` attribute (not `type`, which 2.0 bindings do not have) to resolve what a binding implements, and matches operations by `ref` not `name`', () => {
    // Regression test: WSDL 1.1 bindings reference their portType via a
    // `type` attribute; WSDL 2.0 bindings instead use `interface` (`type`
    // is not a WSDL 2.0 binding attribute at all), and WSDL 2.0 binding
    // operations reference the interface operation via `ref`, not `name`.
    // Reading `type`/`name` unconditionally for both versions silently
    // produced an empty binding type and an empty operation name for every
    // WSDL 2.0 document, breaking ValidateWsdl's cross-reference check and
    // ResolveOperationEndpoint/GetOperation's binding lookup for 2.0.
    const out = listBindings(testContext, makeInput(WSDL2_SAMPLE));
    expect(out.getBindingsList().length).toBe(1);
    const binding = out.getBindingsList()[0];
    expect(binding.getType()).toBe('tns:StockQuoteInterface');
    expect(binding.getOperationsList().length).toBe(1);
    expect(binding.getOperationsList()[0].getName()).toBe('GetLastTradePrice');
  });
});
