import { WsdlInput } from '../gen/messages_pb';
import { listOperations } from './list_operations';
import { testContext } from './lib/test_context';
import { STOCK_QUOTE_WSDL } from './lib/fixtures';

function makeInput(wsdl: string): WsdlInput {
  const i = new WsdlInput();
  i.setWsdl(wsdl);
  return i;
}

describe('ListOperations', () => {
  it('inventories both operations across the document, flagging which has faults', () => {
    const out = listOperations(testContext, makeInput(STOCK_QUOTE_WSDL));
    expect(out.getError()).toBe('');
    expect(out.getOperationsList().length).toBe(2);

    const getOp = out.getOperationsList().find((o) => o.getName() === 'GetLastTradePrice')!;
    expect(getOp.getPortTypeName()).toBe('StockQuotePortType');
    expect(getOp.getInputMessage()).toBe('tns:GetLastTradePriceInput');
    expect(getOp.getHasFaults()).toBe(true);

    const subOp = out.getOperationsList().find((o) => o.getName() === 'SubscribeToPrice')!;
    expect(subOp.getHasFaults()).toBe(false);
  });
});
