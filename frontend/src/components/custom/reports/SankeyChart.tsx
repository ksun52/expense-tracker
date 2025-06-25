import React from 'react';
import { Card, Typography } from '@mui/material';
import { Sankey, Tooltip } from 'recharts';

export interface SankeyNode {
  name: string;
}

export interface SankeyLink {
  source: number;
  target: number;
  value: number;
}

export interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

interface SankeyChartProps {
  data: SankeyData;
}

const SankeyChart: React.FC<SankeyChartProps> = ({ data }) => (
  <Card sx={{ p: 2 }}>
    <Typography variant="h6" mb={2}>
      Cash Flow
    </Typography>
    <Sankey
      width={900}
      height={400}
      data={data}
      nodePadding={30}
      margin={{ left: 50, right: 50, top: 20, bottom: 20 }}
    >
      <Tooltip />
    </Sankey>
  </Card>
);

export default SankeyChart; 