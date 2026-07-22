import { WsdlInput } from '../gen/messages_pb';
import { summarizeWsdl } from './summarize_wsdl';
import { testContext } from './lib/test_context';
import { STOCK_QUOTE_WSDL } from './lib/fixtures';

function makeInput(wsdl: string): WsdlInput {
  const i = new WsdlInput();
  i.setWsdl(wsdl);
  return i;
}

describe('SummarizeWsdl', () => {
  it('counts every section correctly against the hand-derived fixture', () => {
    const out = summarizeWsdl(testContext, makeInput(STOCK_QUOTE_WSDL));
    expect(out.getError()).toBe('');
    expect(out.getVersion()).toBe('1.1');
    expect(out.getTargetNamespace()).toBe('http://example.com/stockquote.wsdl');
    expect(out.getServiceCount()).toBe(1);
    expect(out.getPortCount()).toBe(2);
    expect(out.getBindingCount()).toBe(2);
    expect(out.getPortTypeCount()).toBe(1);
    expect(out.getOperationCount()).toBe(2);
    expect(out.getMessageCount()).toBe(3);
    expect(out.getComplexTypeCount()).toBe(2);
    expect(out.getElementCount()).toBe(2);
    expect(out.getImportCount()).toBe(0);
  });

  it('returns a structured error, all counts zero, for unparseable input', () => {
    const out = summarizeWsdl(testContext, makeInput('<unclosed'));
    expect(out.getError()).not.toBe('');
    expect(out.getServiceCount()).toBe(0);
  });
});
