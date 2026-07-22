import { GetOperationInput } from '../gen/messages_pb';
import { getOperation } from './get_operation';
import { testContext } from './lib/test_context';
import { STOCK_QUOTE_WSDL } from './lib/fixtures';

function makeInput(wsdl: string, operationName: string, portTypeName = ''): GetOperationInput {
  const i = new GetOperationInput();
  i.setWsdl(wsdl);
  i.setOperationName(operationName);
  i.setPortTypeName(portTypeName);
  return i;
}

describe('GetOperation', () => {
  it('finds an operation with a fault and resolves its SOAP action from the (first, document-order) SOAP binding', () => {
    const out = getOperation(testContext, makeInput(STOCK_QUOTE_WSDL, 'GetLastTradePrice'));
    expect(out.getFound()).toBe(true);
    expect(out.getPortTypeName()).toBe('StockQuotePortType');
    expect(out.getInputMessage()).toBe('tns:GetLastTradePriceInput');
    expect(out.getOutputMessage()).toBe('tns:GetLastTradePriceOutput');
    expect(out.getFaultMessagesList()).toEqual(['tns:InvalidTickerFault']);
    expect(out.getSoapAction()).toBe('http://example.com/GetLastTradePrice');
    expect(out.getStyle()).toBe('document');
    expect(out.getError()).toBe('');
  });

  it('finds an input-only operation and resolves its SOAP action inherited from binding-level style', () => {
    const out = getOperation(testContext, makeInput(STOCK_QUOTE_WSDL, 'SubscribeToPrice'));
    expect(out.getFound()).toBe(true);
    expect(out.getSoapAction()).toBe('http://example.com/SubscribeToPrice');
    expect(out.getStyle()).toBe('document');
  });

  it('accepts an explicit port_type_name disambiguator', () => {
    const out = getOperation(testContext, makeInput(STOCK_QUOTE_WSDL, 'GetLastTradePrice', 'StockQuotePortType'));
    expect(out.getFound()).toBe(true);
  });

  it('returns found=false and a structured error for an unknown operation', () => {
    const out = getOperation(testContext, makeInput(STOCK_QUOTE_WSDL, 'NoSuchOperation'));
    expect(out.getFound()).toBe(false);
    expect(out.getError()).not.toBe('');
  });

  it('is deterministic across repeated calls', () => {
    const a = getOperation(testContext, makeInput(STOCK_QUOTE_WSDL, 'GetLastTradePrice'));
    const b = getOperation(testContext, makeInput(STOCK_QUOTE_WSDL, 'GetLastTradePrice'));
    expect(a.serializeBinary()).toEqual(b.serializeBinary());
  });
});
