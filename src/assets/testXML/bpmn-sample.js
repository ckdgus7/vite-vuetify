export default `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                  xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
                  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
                  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
                  xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
                  xmlns:camunda="http://camunda.org/schema/1.0/bpmn"
                  id="Definitions_EApproval"
                  targetNamespace="http://bpmn.io/schema/bpmn">

  <bpmn:process id="ElectronicApprovalProcess" name="전자결재 프로세스" isExecutable="true">

    <bpmn:startEvent id="StartEvent_CreateDoc" name="결재 문서 작성">
      <bpmn:outgoing>Flow_StartToWrite</bpmn:outgoing>
    </bpmn:startEvent>

    <bpmn:userTask id="UserTask_Write" name="문서 작성 및 제출"
                   camunda:assignee="employee"
                   camunda:formKey="approvalForm">
      <bpmn:incoming>Flow_StartToWrite</bpmn:incoming>
      <bpmn:outgoing>Flow_ToManagerApproval</bpmn:outgoing>
    </bpmn:userTask>

    <bpmn:userTask id="UserTask_Manager" name="팀장 승인"
                   camunda:assignee="manager"
                   camunda:formKey="managerApprovalForm">
      <bpmn:incoming>Flow_ToManagerApproval</bpmn:incoming>
      <bpmn:outgoing>Flow_ManagerToExec</bpmn:outgoing>
    </bpmn:userTask>

    <bpmn:userTask id="UserTask_Executive" name="임원 승인"
                   camunda:assignee="executive"
                   camunda:formKey="executiveApprovalForm">
      <bpmn:incoming>Flow_ManagerToExec</bpmn:incoming>
      <bpmn:outgoing>Flow_ExecToGateway</bpmn:outgoing>
    </bpmn:userTask>

    <bpmn:exclusiveGateway id="Gateway_ApprovalResult" name="승인 여부 판단">
      <bpmn:incoming>Flow_ExecToGateway</bpmn:incoming>
      <bpmn:outgoing>Flow_ApprovedToArchive</bpmn:outgoing>
      <bpmn:outgoing>Flow_RejectedToTrash</bpmn:outgoing>
    </bpmn:exclusiveGateway>

    <bpmn:serviceTask id="Service_Archive" name="문서 저장"
                      camunda:type="external"
                      camunda:topic="archive-document">
      <bpmn:incoming>Flow_ApprovedToArchive</bpmn:incoming>
      <bpmn:outgoing>Flow_ArchiveToNotify</bpmn:outgoing>
    </bpmn:serviceTask>

    <bpmn:serviceTask id="Service_Notify" name="결재 완료 알림"
                      camunda:type="external"
                      camunda:topic="send-notification">
      <bpmn:incoming>Flow_ArchiveToNotify</bpmn:incoming>
      <bpmn:outgoing>Flow_NotifyToEnd</bpmn:outgoing>
    </bpmn:serviceTask>

    <bpmn:endEvent id="End_Approved" name="결재 완료">
      <bpmn:incoming>Flow_NotifyToEnd</bpmn:incoming>
    </bpmn:endEvent>

    <bpmn:serviceTask id="Service_Trash" name="문서 폐기"
                      camunda:type="external"
                      camunda:topic="delete-document">
      <bpmn:incoming>Flow_RejectedToTrash</bpmn:incoming>
      <bpmn:outgoing>Flow_TrashToEnd</bpmn:outgoing>
    </bpmn:serviceTask>

    <bpmn:endEvent id="End_Rejected" name="결재 반려 종료">
      <bpmn:incoming>Flow_TrashToEnd</bpmn:incoming>
    </bpmn:endEvent>

    <!-- Sequence Flows -->
    <bpmn:sequenceFlow id="Flow_StartToWrite" sourceRef="StartEvent_CreateDoc" targetRef="UserTask_Write"/>
    <bpmn:sequenceFlow id="Flow_ToManagerApproval" sourceRef="UserTask_Write" targetRef="UserTask_Manager"/>
    <bpmn:sequenceFlow id="Flow_ManagerToExec" sourceRef="UserTask_Manager" targetRef="UserTask_Executive"/>
    <bpmn:sequenceFlow id="Flow_ExecToGateway" sourceRef="UserTask_Executive" targetRef="Gateway_ApprovalResult"/>
    <bpmn:sequenceFlow id="Flow_ApprovedToArchive" sourceRef="Gateway_ApprovalResult" targetRef="Service_Archive">
      <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression">\${approved == true}</bpmn:conditionExpression>
    </bpmn:sequenceFlow>
    <bpmn:sequenceFlow id="Flow_RejectedToTrash" sourceRef="Gateway_ApprovalResult" targetRef="Service_Trash">
      <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression">\${approved == false}</bpmn:conditionExpression>
    </bpmn:sequenceFlow>
    <bpmn:sequenceFlow id="Flow_ArchiveToNotify" sourceRef="Service_Archive" targetRef="Service_Notify"/>
    <bpmn:sequenceFlow id="Flow_NotifyToEnd" sourceRef="Service_Notify" targetRef="End_Approved"/>
    <bpmn:sequenceFlow id="Flow_TrashToEnd" sourceRef="Service_Trash" targetRef="End_Rejected"/>

  </bpmn:process>

  <bpmndi:BPMNDiagram id="Diagram_EApproval">
    <bpmndi:BPMNPlane id="Plane_EApproval" bpmnElement="ElectronicApprovalProcess">

      <!-- Nodes -->
      <bpmndi:BPMNShape id="StartEvent_CreateDoc_di" bpmnElement="StartEvent_CreateDoc">
        <dc:Bounds x="100" y="120" width="36" height="36"/>
      </bpmndi:BPMNShape>

      <bpmndi:BPMNShape id="UserTask_Write_di" bpmnElement="UserTask_Write">
        <dc:Bounds x="180" y="100" width="120" height="80"/>
      </bpmndi:BPMNShape>

      <bpmndi:BPMNShape id="UserTask_Manager_di" bpmnElement="UserTask_Manager">
        <dc:Bounds x="330" y="100" width="120" height="80"/>
      </bpmndi:BPMNShape>

      <bpmndi:BPMNShape id="UserTask_Executive_di" bpmnElement="UserTask_Executive">
        <dc:Bounds x="480" y="100" width="120" height="80"/>
      </bpmndi:BPMNShape>

      <bpmndi:BPMNShape id="Gateway_ApprovalResult_di" bpmnElement="Gateway_ApprovalResult" isMarkerVisible="true">
        <dc:Bounds x="630" y="115" width="50" height="50"/>
      </bpmndi:BPMNShape>

      <bpmndi:BPMNShape id="Service_Archive_di" bpmnElement="Service_Archive">
        <dc:Bounds x="720" y="60" width="120" height="80"/>
      </bpmndi:BPMNShape>

      <bpmndi:BPMNShape id="Service_Notify_di" bpmnElement="Service_Notify">
        <dc:Bounds x="870" y="60" width="120" height="80"/>
      </bpmndi:BPMNShape>

      <bpmndi:BPMNShape id="End_Approved_di" bpmnElement="End_Approved">
        <dc:Bounds x="1020" y="80" width="36" height="36"/>
      </bpmndi:BPMNShape>

      <bpmndi:BPMNShape id="Service_Trash_di" bpmnElement="Service_Trash">
        <dc:Bounds x="720" y="180" width="120" height="80"/>
      </bpmndi:BPMNShape>

      <bpmndi:BPMNShape id="End_Rejected_di" bpmnElement="End_Rejected">
        <dc:Bounds x="870" y="200" width="36" height="36"/>
      </bpmndi:BPMNShape>

      <!-- Sequence Flows -->
      <bpmndi:BPMNEdge id="Flow_StartToWrite_di" bpmnElement="Flow_StartToWrite">
        <di:waypoint x="136" y="138"/>
        <di:waypoint x="180" y="138"/>
      </bpmndi:BPMNEdge>

      <bpmndi:BPMNEdge id="Flow_ToManagerApproval_di" bpmnElement="Flow_ToManagerApproval">
        <di:waypoint x="300" y="138"/>
        <di:waypoint x="330" y="138"/>
      </bpmndi:BPMNEdge>

      <bpmndi:BPMNEdge id="Flow_ManagerToExec_di" bpmnElement="Flow_ManagerToExec">
        <di:waypoint x="450" y="138"/>
        <di:waypoint x="480" y="138"/>
      </bpmndi:BPMNEdge>

      <bpmndi:BPMNEdge id="Flow_ExecToGateway_di" bpmnElement="Flow_ExecToGateway">
        <di:waypoint x="600" y="138"/>
        <di:waypoint x="630" y="138"/>
      </bpmndi:BPMNEdge>

      <bpmndi:BPMNEdge id="Flow_ApprovedToArchive_di" bpmnElement="Flow_ApprovedToArchive">
        <di:waypoint x="680" y="138"/>
        <di:waypoint x="780" y="100"/>
      </bpmndi:BPMNEdge>

      <bpmndi:BPMNEdge id="Flow_ArchiveToNotify_di" bpmnElement="Flow_ArchiveToNotify">
        <di:waypoint x="840" y="100"/>
        <di:waypoint x="870" y="100"/>
      </bpmndi:BPMNEdge>

      <bpmndi:BPMNEdge id="Flow_NotifyToEnd_di" bpmnElement="Flow_NotifyToEnd">
        <di:waypoint x="990" y="100"/>
        <di:waypoint x="1020" y="100"/>
      </bpmndi:BPMNEdge>

      <bpmndi:BPMNEdge id="Flow_RejectedToTrash_di" bpmnElement="Flow_RejectedToTrash">
        <di:waypoint x="680" y="138"/>
        <di:waypoint x="720" y="220"/>
      </bpmndi:BPMNEdge>

      <bpmndi:BPMNEdge id="Flow_TrashToEnd_di" bpmnElement="Flow_TrashToEnd">
        <di:waypoint x="840" y="220"/>
        <di:waypoint x="870" y="220"/>
      </bpmndi:BPMNEdge>

    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
`;
