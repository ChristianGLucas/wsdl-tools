import { WsdlInput } from '../gen/messages_pb';
import { listPortTypes } from './list_port_types';
import { testContext } from './lib/test_context';
import { STOCK_QUOTE_WSDL } from './lib/fixtures';

function makeInput(wsdl: string): WsdlInput {
  const i = new WsdlInput();
  i.setWsdl(wsdl);
  return i;
}

describe('ListPortTypes', () => {
  it('lists the portType and its two operations, including the input-only one and the fault', () => {
    const out = listPortTypes(testContext, makeInput(STOCK_QUOTE_WSDL));
    expect(out.getError()).toBe('');
    expect(out.getPortTypesList().length).toBe(1);
    const pt = out.getPortTypesList()[0];
    expect(pt.getName()).toBe('StockQuotePortType');
    expect(pt.getOperationsList().length).toBe(2);

    const getOp = pt.getOperationsList().find((o) => o.getName() === 'GetLastTradePrice')!;
    expect(getOp.getInputMessage()).toBe('tns:GetLastTradePriceInput');
    expect(getOp.getOutputMessage()).toBe('tns:GetLastTradePriceOutput');
    expect(getOp.getFaultMessagesList()).toEqual(['tns:InvalidTickerFault']);

    const subOp = pt.getOperationsList().find((o) => o.getName() === 'SubscribeToPrice')!;
    expect(subOp.getInputMessage()).toBe('tns:GetLastTradePriceInput');
    expect(subOp.getOutputMessage()).toBe('');
    expect(subOp.getFaultMessagesList()).toEqual([]);
  });
});
