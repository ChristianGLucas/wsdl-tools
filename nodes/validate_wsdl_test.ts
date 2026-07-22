import { WsdlInput } from '../gen/messages_pb';
import { validateWsdl } from './validate_wsdl';
import { testContext } from './lib/test_context';
import { STOCK_QUOTE_WSDL, BROKEN_REFS_WSDL, NOT_WSDL_XML, WSDL2_SAMPLE } from './lib/fixtures';

function makeInput(wsdl: string): WsdlInput {
  const i = new WsdlInput();
  i.setWsdl(wsdl);
  return i;
}

describe('ValidateWsdl', () => {
  it('reports valid=true with zero issues for a well-formed document', () => {
    const out = validateWsdl(testContext, makeInput(STOCK_QUOTE_WSDL));
    expect(out.getValid()).toBe(true);
    expect(out.getVersion()).toBe('1.1');
    expect(out.getIssuesList().length).toBe(0);
  });

  it('reports valid=false with specific error issues for broken binding/port cross-references', () => {
    const out = validateWsdl(testContext, makeInput(BROKEN_REFS_WSDL));
    expect(out.getValid()).toBe(false);
    const codes = out.getIssuesList().map((i) => i.getCode());
    expect(codes).toContain('BINDING_TYPE_NOT_FOUND');
    expect(codes).toContain('PORT_BINDING_NOT_FOUND');
    const errorIssues = out.getIssuesList().filter((i) => i.getSeverity() === 'error');
    expect(errorIssues.length).toBe(2);
  });

  it('reports valid=true (no false-positive BINDING_TYPE_NOT_FOUND) for a spec-correct WSDL 2.0 document', () => {
    // Regression test: a WSDL 2.0 <binding> references its interface via the
    // `interface` attribute, not `type` (whose value in 2.0 is an unrelated
    // protocol/extension URI). Reading `type` unconditionally previously made
    // this exact, fully-valid document report a false BINDING_TYPE_NOT_FOUND.
    const out = validateWsdl(testContext, makeInput(WSDL2_SAMPLE));
    expect(out.getValid()).toBe(true);
    expect(out.getVersion()).toBe('2.0');
    expect(out.getIssuesList().map((i) => i.getCode())).not.toContain('BINDING_TYPE_NOT_FOUND');
  });

  it('reports the missing WSDL root as a structural issue, not a top-level crash', () => {
    const out = validateWsdl(testContext, makeInput(NOT_WSDL_XML));
    expect(out.getValid()).toBe(false);
    expect(out.getVersion()).toBe('unknown');
    expect(out.getIssuesList().length).toBe(1);
    expect(out.getIssuesList()[0].getSeverity()).toBe('error');
    expect(out.getIssuesList()[0].getCode()).toBe('NOT_WSDL_ROOT');
  });
});
