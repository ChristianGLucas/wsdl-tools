import { WsdlInput } from '../gen/messages_pb';
import { listTypes } from './list_types';
import { testContext } from './lib/test_context';
import { STOCK_QUOTE_WSDL } from './lib/fixtures';

function makeInput(wsdl: string): WsdlInput {
  const i = new WsdlInput();
  i.setWsdl(wsdl);
  return i;
}

describe('ListTypes', () => {
  it('extracts the inline XSD types: 2 top-level elements, 2 complexTypes with their fields', () => {
    const out = listTypes(testContext, makeInput(STOCK_QUOTE_WSDL));
    expect(out.getError()).toBe('');
    expect(out.getTargetNamespace()).toBe('http://example.com/stockquote.xsd');
    expect(out.getElementsList().length).toBe(2);
    expect(out.getElementsList().map((e) => e.getName()).sort()).toEqual(['TradePrice', 'TradePriceRequest']);

    expect(out.getComplexTypesList().length).toBe(2);
    const reqType = out.getComplexTypesList().find((c) => c.getName() === 'TradePriceRequestType')!;
    expect(reqType.getFieldsList().length).toBe(1);
    expect(reqType.getFieldsList()[0].getName()).toBe('tickerSymbol');
    expect(reqType.getFieldsList()[0].getType()).toBe('xsd:string');
    expect(reqType.getFieldsList()[0].getMinOccurs()).toBe('1');
    expect(reqType.getFieldsList()[0].getMaxOccurs()).toBe('1');

    const errorType = out.getComplexTypesList().find((c) => c.getName() === 'ErrorType')!;
    expect(errorType.getFieldsList().length).toBe(2);
    const messageField = errorType.getFieldsList().find((f) => f.getName() === 'message')!;
    expect(messageField.getMinOccurs()).toBe('1');
    expect(messageField.getMaxOccurs()).toBe('unbounded');
    const codeField = errorType.getFieldsList().find((f) => f.getName() === 'code')!;
    expect(codeField.getMinOccurs()).toBe('0');
  });

  it('returns empty lists (not an error) for a WSDL with no <types> section', () => {
    const wsdl = `<wsdl:definitions xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/"></wsdl:definitions>`;
    const out = listTypes(testContext, makeInput(wsdl));
    expect(out.getError()).toBe('');
    expect(out.getElementsList().length).toBe(0);
    expect(out.getComplexTypesList().length).toBe(0);
  });
});
