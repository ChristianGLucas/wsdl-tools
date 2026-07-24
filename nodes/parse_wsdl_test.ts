import { WsdlInput } from '../gen/messages_pb';
import { parseWsdl } from './parse_wsdl';
import { testContext } from './lib/test_context';
import { STOCK_QUOTE_WSDL, MALFORMED_XML, XXE_WSDL } from './lib/fixtures';

function makeInput(wsdl: string): WsdlInput {
  const i = new WsdlInput();
  i.setWsdl(wsdl);
  return i;
}

describe('ParseWsdl', () => {
  it('parses the full structure of a realistic WSDL 1.1 document — hand-derived oracle', () => {
    const out = parseWsdl(testContext, makeInput(STOCK_QUOTE_WSDL));

    expect(out.getError()).toBe('');
    expect(out.getVersion()).toBe('1.1');
    expect(out.getTargetNamespace()).toBe('http://example.com/stockquote.wsdl');
    expect(out.getNamespacesList().length).toBe(6);
    expect(out.getNamespacesList().map((n) => n.getPrefix()).sort()).toEqual(['soap', 'soap12', 'tns', 'wsdl', 'xsd', 'xsd1'].sort());

    // Services + ports (including cross-referenced transport resolution).
    expect(out.getServicesList().length).toBe(1);
    const svc = out.getServicesList()[0];
    expect(svc.getName()).toBe('StockQuoteService');
    expect(svc.getPortsList().length).toBe(2);
    const soap11Port = svc.getPortsList().find((p) => p.getName() === 'StockQuoteSoapPort')!;
    expect(soap11Port.getBinding()).toBe('tns:StockQuoteSoapBinding');
    expect(soap11Port.getAddressLocation()).toBe('http://example.com/stockquote11');
    expect(soap11Port.getTransport()).toBe('http://schemas.xmlsoap.org/soap/http');
    const soap12Port = svc.getPortsList().find((p) => p.getName() === 'StockQuoteSoap12Port')!;
    expect(soap12Port.getAddressLocation()).toBe('http://example.com/stockquote12');
    expect(soap12Port.getTransport()).toBe('http://schemas.xmlsoap.org/soap12/http');

    // Bindings: SOAP 1.1 vs 1.2 correctly distinguished by extension namespace.
    expect(out.getBindingsList().length).toBe(2);
    const b11 = out.getBindingsList().find((b) => b.getName() === 'StockQuoteSoapBinding')!;
    expect(b11.getSoapVersion()).toBe('1.1');
    expect(b11.getTransport()).toBe('http://schemas.xmlsoap.org/soap/http');
    expect(b11.getStyle()).toBe('document');
    expect(b11.getOperationsList().find((o) => o.getName() === 'GetLastTradePrice')!.getSoapAction()).toBe(
      'http://example.com/GetLastTradePrice'
    );
    const b12 = out.getBindingsList().find((b) => b.getName() === 'StockQuoteSoap12Binding')!;
    expect(b12.getSoapVersion()).toBe('1.2');
    expect(b12.getOperationsList().find((o) => o.getName() === 'GetLastTradePrice')!.getSoapAction()).toBe(
      'http://example.com/GetLastTradePrice12'
    );

    // PortTypes/operations, including a fault and an input-only (notification) operation.
    expect(out.getPortTypesList().length).toBe(1);
    const pt = out.getPortTypesList()[0];
    expect(pt.getName()).toBe('StockQuotePortType');
    expect(pt.getOperationsList().length).toBe(2);
    const getOp = pt.getOperationsList().find((o) => o.getName() === 'GetLastTradePrice')!;
    expect(getOp.getInputMessage()).toBe('tns:GetLastTradePriceInput');
    expect(getOp.getOutputMessage()).toBe('tns:GetLastTradePriceOutput');
    expect(getOp.getFaultMessagesList()).toEqual(['tns:InvalidTickerFault']);
    const subOp = pt.getOperationsList().find((o) => o.getName() === 'SubscribeToPrice')!;
    expect(subOp.getOutputMessage()).toBe('');
    expect(subOp.getFaultMessagesList()).toEqual([]);

    // Messages + parts.
    expect(out.getMessagesList().length).toBe(3);
    const faultMsg = out.getMessagesList().find((m) => m.getName() === 'InvalidTickerFault')!;
    expect(faultMsg.getPartsList().length).toBe(1);
    expect(faultMsg.getPartsList()[0].getName()).toBe('fault');
    expect(faultMsg.getPartsList()[0].getType()).toBe('xsd1:ErrorType');

    // Inline XSD types.
    expect(out.getTypesElementsList().length).toBe(2);
    expect(out.getTypesElementsList().map((e) => e.getName()).sort()).toEqual(['TradePrice', 'TradePriceRequest']);
    expect(out.getTypesComplexTypesList().length).toBe(2);
    const errorType = out.getTypesComplexTypesList().find((c) => c.getName() === 'ErrorType')!;
    expect(errorType.getFieldsList().length).toBe(2);
    const messageField = errorType.getFieldsList().find((f) => f.getName() === 'message')!;
    expect(messageField.getMaxOccurs()).toBe('unbounded');
    expect(messageField.getMinOccurs()).toBe('1');

    expect(out.getImportsList().length).toBe(0);
  });

  it('is deterministic — the same input produces byte-identical output across calls', () => {
    const a = parseWsdl(testContext, makeInput(STOCK_QUOTE_WSDL));
    const b = parseWsdl(testContext, makeInput(STOCK_QUOTE_WSDL));
    expect(a.serializeBinary()).toEqual(b.serializeBinary());
  });

  it('returns a structured error, not a crash, for malformed XML', () => {
    const out = parseWsdl(testContext, makeInput(MALFORMED_XML));
    expect(out.getError()).not.toBe('');
    expect(out.getServicesList().length).toBe(0);
  });

  it('returns a structured error for empty input rather than throwing', () => {
    const out = parseWsdl(testContext, makeInput(''));
    expect(out.getError()).not.toBe('');
  });

  it('rejects an XXE attempt outright — never resolves or leaks the external entity', () => {
    const out = parseWsdl(testContext, makeInput(XXE_WSDL));
    // fast-xml-parser refuses external/DOCTYPE entities; the node must
    // surface that as a structured error, and the entity name/content must
    // never appear anywhere in the (empty, on error) parsed output.
    expect(out.getError()).not.toBe('');
    expect(out.getTargetNamespace()).not.toContain('passwd');
    expect(out.getServicesList().length).toBe(0);
  });

  it('rejects a document with pathological tag nesting before it reaches the XML parser', () => {
    const deep = '<wsdl:definitions xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/">' + '<a>'.repeat(500) + '</a>'.repeat(500) + '</wsdl:definitions>';
    const out = parseWsdl(testContext, makeInput(deep));
    expect(out.getError()).toMatch(/nesting/i);
  });

  it('handles a large input without crashing (no payload-size limit)', () => {
    // No byte-size cap is imposed by this node -- the platform bounds
    // payload size, not this node. A large document still returns a
    // structured result rather than crashing or hanging.
    const huge =
      '<wsdl:definitions xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/" targetNamespace="urn:x">' +
      '<!-- ' + 'x'.repeat(4 * 1024 * 1024) + ' -->' +
      '</wsdl:definitions>';
    const out = parseWsdl(testContext, makeInput(huge));
    expect(out.getError()).toBe('');
    expect(out.getTargetNamespace()).toBe('urn:x');
  });
});
