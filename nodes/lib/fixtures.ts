// Shared WSDL fixtures for the node test suite. STOCK_QUOTE_WSDL is a
// realistic, hand-authored WSDL 1.1 document (in the tradition of the
// classic W3C stock-quote example) covering every construct this package
// parses: two SOAP bindings (1.1 and 1.2) over the same portType, a
// notification-style (input-only) operation, a fault, an inline XSD
// <types> section with both element and complexType declarations, and
// explicit namespace prefixes throughout. Every "expected" value asserted
// against it in the node tests is hand-derived by reading this text, not by
// re-running the code under test — that is what makes those tests an
// independent oracle rather than a self-consistency check.

export const STOCK_QUOTE_WSDL = `<?xml version="1.0" encoding="UTF-8"?>
<wsdl:definitions
    name="StockQuoteService"
    targetNamespace="http://example.com/stockquote.wsdl"
    xmlns:tns="http://example.com/stockquote.wsdl"
    xmlns:xsd1="http://example.com/stockquote.xsd"
    xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
    xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/"
    xmlns:xsd="http://www.w3.org/2001/XMLSchema"
    xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/">

  <wsdl:types>
    <xsd:schema targetNamespace="http://example.com/stockquote.xsd">
      <xsd:element name="TradePriceRequest">
        <xsd:complexType>
          <xsd:sequence>
            <xsd:element name="tickerSymbol" type="xsd:string"/>
          </xsd:sequence>
        </xsd:complexType>
      </xsd:element>
      <xsd:element name="TradePrice">
        <xsd:complexType>
          <xsd:sequence>
            <xsd:element name="price" type="xsd:float"/>
          </xsd:sequence>
        </xsd:complexType>
      </xsd:element>
      <xsd:complexType name="TradePriceRequestType">
        <xsd:sequence>
          <xsd:element name="tickerSymbol" type="xsd:string" minOccurs="1" maxOccurs="1"/>
        </xsd:sequence>
      </xsd:complexType>
      <xsd:complexType name="ErrorType">
        <xsd:sequence>
          <xsd:element name="code" type="xsd:int" minOccurs="0" maxOccurs="1"/>
          <xsd:element name="message" type="xsd:string" minOccurs="1" maxOccurs="unbounded"/>
        </xsd:sequence>
      </xsd:complexType>
    </xsd:schema>
  </wsdl:types>

  <wsdl:message name="GetLastTradePriceInput">
    <wsdl:part name="body" element="xsd1:TradePriceRequest"/>
  </wsdl:message>
  <wsdl:message name="GetLastTradePriceOutput">
    <wsdl:part name="body" element="xsd1:TradePrice"/>
  </wsdl:message>
  <wsdl:message name="InvalidTickerFault">
    <wsdl:part name="fault" type="xsd1:ErrorType"/>
  </wsdl:message>

  <wsdl:portType name="StockQuotePortType">
    <wsdl:operation name="GetLastTradePrice">
      <wsdl:input message="tns:GetLastTradePriceInput"/>
      <wsdl:output message="tns:GetLastTradePriceOutput"/>
      <wsdl:fault name="InvalidTicker" message="tns:InvalidTickerFault"/>
    </wsdl:operation>
    <wsdl:operation name="SubscribeToPrice">
      <wsdl:input message="tns:GetLastTradePriceInput"/>
    </wsdl:operation>
  </wsdl:portType>

  <wsdl:binding name="StockQuoteSoapBinding" type="tns:StockQuotePortType">
    <soap:binding style="document" transport="http://schemas.xmlsoap.org/soap/http"/>
    <wsdl:operation name="GetLastTradePrice">
      <soap:operation soapAction="http://example.com/GetLastTradePrice" style="document"/>
      <wsdl:input><soap:body use="literal"/></wsdl:input>
      <wsdl:output><soap:body use="literal"/></wsdl:output>
      <wsdl:fault name="InvalidTicker"><soap:fault name="InvalidTicker" use="literal"/></wsdl:fault>
    </wsdl:operation>
    <wsdl:operation name="SubscribeToPrice">
      <soap:operation soapAction="http://example.com/SubscribeToPrice"/>
      <wsdl:input><soap:body use="literal"/></wsdl:input>
    </wsdl:operation>
  </wsdl:binding>

  <wsdl:binding name="StockQuoteSoap12Binding" type="tns:StockQuotePortType">
    <soap12:binding style="document" transport="http://schemas.xmlsoap.org/soap12/http"/>
    <wsdl:operation name="GetLastTradePrice">
      <soap12:operation soapAction="http://example.com/GetLastTradePrice12" style="document"/>
      <wsdl:input><soap12:body use="literal"/></wsdl:input>
      <wsdl:output><soap12:body use="literal"/></wsdl:output>
    </wsdl:operation>
    <wsdl:operation name="SubscribeToPrice">
      <soap12:operation soapAction="http://example.com/SubscribeToPrice12"/>
      <wsdl:input><soap12:body use="literal"/></wsdl:input>
    </wsdl:operation>
  </wsdl:binding>

  <wsdl:service name="StockQuoteService">
    <wsdl:port name="StockQuoteSoapPort" binding="tns:StockQuoteSoapBinding">
      <soap:address location="http://example.com/stockquote11"/>
    </wsdl:port>
    <wsdl:port name="StockQuoteSoap12Port" binding="tns:StockQuoteSoap12Binding">
      <soap12:address location="http://example.com/stockquote12"/>
    </wsdl:port>
  </wsdl:service>

</wsdl:definitions>`;

// A minimal, real WSDL 2.0 document: default (unprefixed) namespace on the
// root, an <interface>/<operation> pair using element refs directly (no
// separate <message> construct), and a <service>/<endpoint> with its
// address as a direct attribute (WSDL 2.0 shape, unlike 1.1's nested
// soap:address).
export const WSDL2_SAMPLE = `<?xml version="1.0" encoding="UTF-8"?>
<description xmlns="http://www.w3.org/ns/wsdl"
              xmlns:tns="http://example.com/stockquote2"
              targetNamespace="http://example.com/stockquote2">

  <interface name="StockQuoteInterface">
    <operation name="GetLastTradePrice" pattern="http://www.w3.org/ns/wsdl/in-out">
      <input element="tns:TradePriceRequest"/>
      <output element="tns:TradePrice"/>
    </operation>
  </interface>

  <binding name="StockQuoteSoapBinding" type="tns:StockQuoteInterface" interface="tns:StockQuoteInterface">
  </binding>

  <service name="StockQuoteService" interface="tns:StockQuoteInterface">
    <endpoint name="StockQuoteEndpoint" binding="tns:StockQuoteSoapBinding" address="http://example.com/stockquote2"/>
  </service>

</description>`;

// Declares a WSDL-level <import> and, inside <types>, an <xsd:import> and
// an <xsd:include> — exercises ListImports across all three kinds. Locations
// are intentionally unresolvable (this package must never fetch them).
export const IMPORTS_WSDL = `<?xml version="1.0" encoding="UTF-8"?>
<wsdl:definitions
    name="ImportingService"
    targetNamespace="http://example.com/importing"
    xmlns:tns="http://example.com/importing"
    xmlns:other="http://example.com/other"
    xmlns:xsd="http://www.w3.org/2001/XMLSchema"
    xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/">
  <wsdl:import namespace="http://example.com/other" location="other.wsdl"/>
  <wsdl:types>
    <xsd:schema targetNamespace="http://example.com/importing">
      <xsd:import namespace="http://example.com/ext" schemaLocation="ext.xsd"/>
      <xsd:include schemaLocation="common.xsd"/>
    </xsd:schema>
  </wsdl:types>
</wsdl:definitions>`;

// A binding referencing a portType that was never declared, and a service
// port referencing a binding that was never declared — exercises
// ValidateWsdl's cross-reference checks.
export const BROKEN_REFS_WSDL = `<?xml version="1.0" encoding="UTF-8"?>
<wsdl:definitions
    name="BrokenService"
    targetNamespace="http://example.com/broken"
    xmlns:tns="http://example.com/broken"
    xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/">
  <wsdl:binding name="OrphanBinding" type="tns:NoSuchPortType">
  </wsdl:binding>
  <wsdl:service name="BrokenService">
    <wsdl:port name="OrphanPort" binding="tns:NoSuchBinding">
    </wsdl:port>
  </wsdl:service>
</wsdl:definitions>`;

export const NOT_WSDL_XML = `<?xml version="1.0"?><foo><bar>not a wsdl document</bar></foo>`;

export const MALFORMED_XML = `<wsdl:definitions><wsdl:service name="Unclosed">`;

// A crafted external-entity (XXE) attempt — must be rejected, never resolved.
export const XXE_WSDL = `<?xml version="1.0"?>
<!DOCTYPE wsdl:definitions [
  <!ENTITY xxe SYSTEM "file:///etc/passwd">
]>
<wsdl:definitions name="&xxe;" targetNamespace="http://example.com/xxe" xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/">
</wsdl:definitions>`;
