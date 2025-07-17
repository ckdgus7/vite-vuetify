export default `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                  xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
                  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
                  xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
                  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
                  xmlns:camunda="http://camunda.org/schema/1.0/bpmn"
                  id="Definitions_Vacation"
                  targetNamespace="http://bpmn.io/schema/bpmn">

  <bpmn:process id="VacationRequestProcess" name="휴가 신청 프로세스" isExecutable="true">

    <bpmn:startEvent id="StartEvent_Vacation" name="휴가 신청 시작">
      <bpmn:outgoing>Flow_SubmitRequest</bpmn:outgoing>
    </bpmn:startEvent>

    <bpmn:userTask id="UserTask_Submit" name="휴가 신청서 작성" camunda:assignee="employee" camunda:formKey="vacationForm">
      <bpmn:incoming>Flow_SubmitRequest</bpmn:incoming>
      <bpmn:outgoing>Flow_ToApproval</bpmn:outgoing>
    </bpmn:userTask>

    <bpmn:userTask id="UserTask_Approve" name="팀장 승인" camunda:assignee="manager" camunda:formKey="approvalForm">
      <bpmn:incoming>Flow_ToApproval</bpmn:incoming>
      <bpmn:outgoing>Flow_ApprovalDecision</bpmn:outgoing>
    </bpmn:userTask>

    <bpmn:exclusiveGateway id="Gateway_Approval" name="승인 여부">
      <bpmn:incoming>Flow_ApprovalDecision</bpmn:incoming>
      <bpmn:outgoing>Flow_Approved</bpmn:outgoing>
      <bpmn:outgoing>Flow_Rejected</bpmn:outgoing>
    </bpmn:exclusiveGateway>

    <bpmn:serviceTask id="Service_NotifyHR" name="인사팀 통보" camunda:type="external" camunda:topic="notify-hr">
      <bpmn:incoming>Flow_Approved</bpmn:incoming>
      <bpmn:outgoing>Flow_EndApproved</bpmn:outgoing>
    </bpmn:serviceTask>

    <bpmn:endEvent id="EndEvent_Approved" name="승인 완료">
      <bpmn:incoming>Flow_EndApproved</bpmn:incoming>
    </bpmn:endEvent>

    <bpmn:endEvent id="EndEvent_Rejected" name="반려 종료">
      <bpmn:incoming>Flow_Rejected</bpmn:incoming>
    </bpmn:endEvent>

    <!-- Sequence Flows -->
    <bpmn:sequenceFlow id="Flow_SubmitRequest" sourceRef="StartEvent_Vacation" targetRef="UserTask_Submit"/>
    <bpmn:sequenceFlow id="Flow_ToApproval" sourceRef="UserTask_Submit" targetRef="UserTask_Approve"/>
    <bpmn:sequenceFlow id="Flow_ApprovalDecision" sourceRef="UserTask_Approve" targetRef="Gateway_Approval"/>
    <bpmn:sequenceFlow id="Flow_Approved" sourceRef="Gateway_Approval" targetRef="Service_NotifyHR">
      <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression">\${approved == true}</bpmn:conditionExpression>
    </bpmn:sequenceFlow>
    <bpmn:sequenceFlow id="Flow_Rejected" sourceRef="Gateway_Approval" targetRef="EndEvent_Rejected">
      <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression">\${approved == false}</bpmn:conditionExpression>
    </bpmn:sequenceFlow>
    <bpmn:sequenceFlow id="Flow_EndApproved" sourceRef="Service_NotifyHR" targetRef="EndEvent_Approved"/>

  </bpmn:process>
</bpmn:definitions>
`;
