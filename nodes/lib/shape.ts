// Converts the plain WsdlModel (wsdl.ts) into the generated protobuf message
// classes (gen/messages_pb). Kept separate from wsdl.ts so the WSDL-semantic
// extraction logic never has to know about protobuf getters/setters.

import {
  BindingInfo,
  BindingOperation,
  ImportDecl,
  MessageInfo,
  MessagePart,
  NamespaceDecl,
  OperationSummary,
  Port,
  PortTypeInfo,
  ServiceInfo,
  XsdComplexType,
  XsdElement,
  XsdField,
} from '../../gen/messages_pb';
import {
  ModelBinding,
  ModelBindingOperation,
  ModelImport,
  ModelMessage,
  ModelMessagePart,
  ModelOperation,
  ModelPort,
  ModelPortType,
  ModelService,
  ModelXsdComplexType,
  ModelXsdElement,
  ModelXsdField,
} from './wsdl';

export function toPort(p: ModelPort): Port {
  const m = new Port();
  m.setName(p.name);
  m.setBinding(p.binding);
  m.setAddressLocation(p.addressLocation);
  m.setTransport(p.transport);
  return m;
}

export function toServiceInfo(s: ModelService): ServiceInfo {
  const m = new ServiceInfo();
  m.setName(s.name);
  m.setPortsList(s.ports.map(toPort));
  return m;
}

export function toBindingOperation(o: ModelBindingOperation): BindingOperation {
  const m = new BindingOperation();
  m.setName(o.name);
  m.setSoapAction(o.soapAction);
  m.setStyle(o.style);
  return m;
}

export function toBindingInfo(b: ModelBinding): BindingInfo {
  const m = new BindingInfo();
  m.setName(b.name);
  m.setType(b.type);
  m.setTransport(b.transport);
  m.setStyle(b.style);
  m.setSoapVersion(b.soapVersion);
  m.setOperationsList(b.operations.map(toBindingOperation));
  return m;
}

export function toOperationSummary(o: ModelOperation): OperationSummary {
  const m = new OperationSummary();
  m.setName(o.name);
  m.setInputMessage(o.inputMessage);
  m.setOutputMessage(o.outputMessage);
  m.setFaultMessagesList(o.faultMessages);
  return m;
}

export function toPortTypeInfo(pt: ModelPortType): PortTypeInfo {
  const m = new PortTypeInfo();
  m.setName(pt.name);
  m.setOperationsList(pt.operations.map(toOperationSummary));
  return m;
}

export function toMessagePart(p: ModelMessagePart): MessagePart {
  const m = new MessagePart();
  m.setName(p.name);
  m.setElement(p.element);
  m.setType(p.type);
  return m;
}

export function toMessageInfo(msg: ModelMessage): MessageInfo {
  const m = new MessageInfo();
  m.setName(msg.name);
  m.setPartsList(msg.parts.map(toMessagePart));
  return m;
}

export function toXsdField(f: ModelXsdField): XsdField {
  const m = new XsdField();
  m.setName(f.name);
  m.setType(f.type);
  m.setMinOccurs(f.minOccurs);
  m.setMaxOccurs(f.maxOccurs);
  return m;
}

export function toXsdComplexType(c: ModelXsdComplexType): XsdComplexType {
  const m = new XsdComplexType();
  m.setName(c.name);
  m.setFieldsList(c.fields.map(toXsdField));
  return m;
}

export function toXsdElement(e: ModelXsdElement): XsdElement {
  const m = new XsdElement();
  m.setName(e.name);
  m.setType(e.type);
  return m;
}

export function toNamespaceDecl(n: { prefix: string; uri: string }): NamespaceDecl {
  const m = new NamespaceDecl();
  m.setPrefix(n.prefix);
  m.setUri(n.uri);
  return m;
}

export function toImportDecl(i: ModelImport): ImportDecl {
  const m = new ImportDecl();
  m.setNamespace(i.namespace);
  m.setLocation(i.location);
  m.setKind(i.kind);
  return m;
}
