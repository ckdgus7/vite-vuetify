export default `<mxfile host="app.diagrams.net">
  <diagram name="Conditional Flow" id="ifElseDiagram">
    <mxGraphModel dx="950" dy="620" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />

        <!-- Start -->
        <mxCell id="2" value="Start" style="ellipse;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;" vertex="1" parent="1">
          <mxGeometry x="240" y="50" width="100" height="60" as="geometry" />
        </mxCell>

        <!-- Decision -->
        <mxCell id="3" value="Condition?" style="rhombus;whiteSpace=wrap;html=1;fillColor=#fff2cc;strokeColor=#d6b656;" vertex="1" parent="1">
          <mxGeometry x="240" y="150" width="100" height="80" as="geometry" />
        </mxCell>

        <!-- Yes path -->
        <mxCell id="4" value="Yes Path" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;" vertex="1" parent="1">
          <mxGeometry x="100" y="280" width="120" height="60" as="geometry" />
        </mxCell>

        <!-- No path -->
        <mxCell id="5" value="No Path" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#f8cecc;strokeColor=#b85450;" vertex="1" parent="1">
          <mxGeometry x="380" y="280" width="120" height="60" as="geometry" />
        </mxCell>

        <!-- End -->
        <mxCell id="6" value="End" style="ellipse;whiteSpace=wrap;html=1;fillColor=#e1d5e7;strokeColor=#9673a6;" vertex="1" parent="1">
          <mxGeometry x="240" y="400" width="100" height="60" as="geometry" />
        </mxCell>

        <!-- Arrows -->
        <mxCell id="7" style="endArrow=block;html=1;" edge="1" parent="1" source="2" target="3">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
        <mxCell id="8" value="Yes" style="endArrow=block;html=1;" edge="1" parent="1" source="3" target="4">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
        <mxCell id="9" value="No" style="endArrow=block;html=1;" edge="1" parent="1" source="3" target="5">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
        <mxCell id="10" style="endArrow=block;html=1;" edge="1" parent="1" source="4" target="6">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
        <mxCell id="11" style="endArrow=block;html=1;" edge="1" parent="1" source="5" target="6">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`;
