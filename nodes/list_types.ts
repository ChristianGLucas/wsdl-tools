import { WsdlInput, TypesResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseWsdlDocument } from './lib/wsdl';
import { toXsdComplexType, toXsdElement } from './lib/shape';

/**
 * Extract the inline XSD <types> section's structural summary: the target
 * namespace, every top-level <xsd:element> (name + type), and every
 * top-level <xsd:complexType> (name + its direct fields with their type
 * and min/maxOccurs). Structural only — nested/anonymous type definitions
 * are not recursively expanded; use a dedicated XSD tool for deep schema
 * analysis.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function listTypes(ax: AxiomContext, input: WsdlInput): TypesResult {
  const result = parseWsdlDocument(input.getWsdl());
  const out = new TypesResult();
  if (result.ok === false) {
    out.setError(result.error.message);
    return out;
  }
  out.setTargetNamespace(result.model.typesTargetNamespace);
  out.setElementsList(result.model.typesElements.map(toXsdElement));
  out.setComplexTypesList(result.model.typesComplexTypes.map(toXsdComplexType));
  return out;
}
