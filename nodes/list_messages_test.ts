import { WsdlInput } from '../gen/messages_pb';
import { listMessages } from './list_messages';
import { testContext } from './lib/test_context';
import { STOCK_QUOTE_WSDL, WSDL2_SAMPLE } from './lib/fixtures';

function makeInput(wsdl: string): WsdlInput {
  const i = new WsdlInput();
  i.setWsdl(wsdl);
  return i;
}

describe('ListMessages', () => {
  it('lists all three WSDL 1.1 messages with their parts', () => {
    const out = listMessages(testContext, makeInput(STOCK_QUOTE_WSDL));
    expect(out.getError()).toBe('');
    expect(out.getMessagesList().length).toBe(3);
    const fault = out.getMessagesList().find((m) => m.getName() === 'InvalidTickerFault')!;
    expect(fault.getPartsList().length).toBe(1);
    expect(fault.getPartsList()[0].getName()).toBe('fault');
    expect(fault.getPartsList()[0].getType()).toBe('xsd1:ErrorType');
    expect(fault.getPartsList()[0].getElement()).toBe('');
  });

  it('returns an empty (not error) list for WSDL 2.0, which has no separate message construct', () => {
    const out = listMessages(testContext, makeInput(WSDL2_SAMPLE));
    expect(out.getError()).toBe('');
    expect(out.getMessagesList().length).toBe(0);
  });
});
