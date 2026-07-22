# wsdl-tools

Deterministic parsing and structural inspection of WSDL (Web Services Description
Language) documents — the XML contract format for SOAP/XML web services — built
for the Axiom marketplace (`christiangeorgelucas/wsdl-tools`).

Every node takes caller-supplied WSDL text (WSDL 1.1 or 2.0) and never fetches
anything over the network: `<import>`/`<xsd:import>`/`<xsd:include>` locations
are reported, never resolved. Parsing uses [fast-xml-parser](https://github.com/NaturalIntelligence/fast-xml-parser)
(MIT) — which refuses external/DOCTYPE entities outright, so parsing is XXE-safe
by construction — plus this package's own WSDL-schema knowledge to interpret the
result. This is a document parser, not a SOAP client: it never places a call.

## Nodes

- **ParseWsdl** — full structured parse of a WSDL document in one call (the
  general-purpose parse every other node is a cheaper, specialized view of).
- **DetectWsdlVersion** — classify a document as WSDL 1.1, 2.0, or unknown.
- **ListServices** — every `<service>` and its ports/endpoints.
- **ListEndpoints** — every service endpoint as one flat inventory.
- **ListPortTypes** — every portType/interface and its operations.
- **GetOperation** — one operation's full detail (messages, faults, SOAP action, style).
- **ListOperations** — the whole-document operation inventory.
- **ListMessages** — every WSDL 1.1 abstract message and its parts.
- **ListBindings** — every binding (SOAP transport, style, per-operation soapAction).
- **ListTypes** — the inline XSD `<types>` section's top-level elements/complexTypes.
- **ListNamespaces** — every declared `xmlns` prefix plus the target namespace.
- **ListImports** — every `<import>`/`<xsd:import>`/`<xsd:include>` reference (reported, never fetched).
- **ResolveOperationEndpoint** — resolve an operation all the way to its concrete
  callable SOAP endpoint (portType operation → binding → service port address) —
  the composability node for wiring a SOAP call downstream.
- **SummarizeWsdl** — document-wide counts (services, ports, bindings, operations, ...).
- **ValidateWsdl** — basic structural correctness (root element present, every
  binding/port cross-reference resolves).

## Scope

WSDL 1.1 is supported in full structural depth. WSDL 2.0 is supported
structurally for its analogous constructs (`description`/`interface`/`binding`/
`service`/`endpoint`). The embedded XSD `<types>` section is extracted
structurally (top-level `element`/`complexType` declarations); a nested or
anonymous type definition is not recursively expanded.

## License

MIT — see [LICENSE](./LICENSE).
