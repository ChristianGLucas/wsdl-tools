import { WsdlInput } from '../gen/messages_pb';
import { listImports } from './list_imports';
import { testContext } from './lib/test_context';
import { IMPORTS_WSDL, STOCK_QUOTE_WSDL } from './lib/fixtures';

function makeInput(wsdl: string): WsdlInput {
  const i = new WsdlInput();
  i.setWsdl(wsdl);
  return i;
}

describe('ListImports', () => {
  it('extracts a wsdl:import, an xsd:import, and an xsd:include — locations reported verbatim, never fetched', () => {
    const out = listImports(testContext, makeInput(IMPORTS_WSDL));
    expect(out.getError()).toBe('');
    expect(out.getImportsList().length).toBe(3);

    const wsdlImport = out.getImportsList().find((i) => i.getKind() === 'wsdl_import')!;
    expect(wsdlImport.getNamespace()).toBe('http://example.com/other');
    expect(wsdlImport.getLocation()).toBe('other.wsdl');

    const xsdImport = out.getImportsList().find((i) => i.getKind() === 'xsd_import')!;
    expect(xsdImport.getNamespace()).toBe('http://example.com/ext');
    expect(xsdImport.getLocation()).toBe('ext.xsd');

    const xsdInclude = out.getImportsList().find((i) => i.getKind() === 'xsd_include')!;
    expect(xsdInclude.getLocation()).toBe('common.xsd');
    expect(xsdInclude.getNamespace()).toBe('');
  });

  it('returns an empty list for a document with no imports', () => {
    const out = listImports(testContext, makeInput(STOCK_QUOTE_WSDL));
    expect(out.getError()).toBe('');
    expect(out.getImportsList().length).toBe(0);
  });
});
