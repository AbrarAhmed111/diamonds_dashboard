import { 
  Divider, 
  Grid, 
  H1, 
  H2, 
  H3, 
  Stack, 
  Stat, 
  Table, 
  Text, 
  Card, 
  CardBody, 
  CardHeader, 
  Pill, 
  Link,
  Code,
  useHostTheme
} from 'cursor/canvas';

export default function DashboardBriefing() {
  const theme = useHostTheme();
  
  return (
    <Stack gap={24} padding={20}>
      <Stack gap={8}>
        <H1>Project Briefing: Diamond Pigs Signals Dashboard POC</H1>
        <Text tone="secondary">
          Pixel-Perfect Implementation based on Figma Design & JSON Data
        </Text>
      </Stack>

      <Card>
        <CardHeader 
          title="Project Objective" 
          subtitle="Build a standalone Proof of Concept (POC) frontend"
        />
        <CardBody>
          <Text>
            Create a high-fidelity dashboard application that replicates the provided Figma design with pixel-perfect accuracy. 
            The application must be completely independent of a live backend, consuming all data from a single static JSON file.
          </Text>
        </CardBody>
      </Card>

      <Grid columns={2} gap={16}>
        <Card>
          <CardHeader title="Core Requirements" />
          <CardBody>
            <Stack gap={8}>
              <Text>• **Pixel-Perfect**: Follow margins, colors, and typography of the Figma design exactly.</Text>
              <Text>• **JSON-Driven**: No live API calls; load data from `indicators.json`.</Text>
              <Text>• **Interactive Charts**: Render time-series data for each signal.</Text>
              <Text>• **Filtering & Search**: Client-side filtering by category and keyword.</Text>
            </Stack>
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Tech Stack (Recommended)" />
          <CardBody>
            <Stack gap={8}>
              <Pill tone="success">Next.js 14+ (App Router)</Pill>
              <Pill tone="success">Tailwind CSS</Pill>
              <Pill tone="success">Lucide React Icons</Pill>
              <Pill tone="success">Recharts / Chart.js</Pill>
            </Stack>
          </CardBody>
        </Card>
      </Grid>

      <H2>Data Structure (The "API")</H2>
      <Text>
        The application reads from `indicators.json`. See <Link href="API_DOCUMENTATION.md">API_DOCUMENTATION.md</Link> for full details.
      </Text>
      
      <Card variant="outline">
        <CardHeader title="JSON Sample" />
        <CardBody padding={0}>
          <Code language="json">
{`[
  {
    "id": "btc_price",
    "name": "Bitcoin Price",
    "category": "technical",
    "values": [
      { "timestamp": "2026-05-19", "value": 65432.10 },
      { "timestamp": "2026-05-20", "value": 66120.45 }
    ]
  }
]`}
          </Code>
        </CardBody>
      </Card>

      <H2>Implementation Strategy</H2>
      <Stack gap={16}>
        <Stack gap={4}>
          <H3>1. Figma Import & Setup</H3>
          <Text>
            Utilize **Claude Code**'s Figma import function to jumpstart the UI component creation. Ensure all colors use the Diamond Pigs theme tokens.
          </Text>
        </Stack>
        
        <Stack gap={4}>
          <H3>2. Data Fetching</H3>
          <Text>
            Implement a simple `fetch('/data/indicators.json')` call on the home page or via a React Context/State Management layer.
          </Text>
        </Stack>

        <Stack gap={4}>
          <H3>3. Daily Update Workflow</H3>
          <Text>
            The production version will use a daily cron job to run `indicators_export.py`, which refreshes the JSON file. 
            The POC should simulate this by allowing the user to swap out the JSON file manually.
          </Text>
        </Stack>
      </Stack>

      <Divider />
      
      <Divider />
      
      <H2>Delivery & Hosting Instructions</H2>
      <Stack gap={12}>
        <Text>• **Repository**: Deliver via Private GitLab or GitHub repository.</Text>
        <Text>• **Test Environment**: Host the POC on a platform like Vercel or Netlify for instant preview.</Text>
        <Text>• **URL Documentation**: Provide the live URL in a `POC_INFO.md` file in the repo.</Text>
        <Text>• **Next.js Export**: Ensure the app uses `output: 'export'` for easy static hosting.</Text>
      </Stack>

      <H2>Deliverables</H2>
      <Table
        headers={["Phase", "Description", "Priority"]}
        rows={[
          ["Layout", "Main sidebar, header, and grid layout", "Critical"],
          ["Data Integration", "JSON loading and state management", "Critical"],
          ["Signal Cards", "Detailed signal metadata and mini-charts", "High"],
          ["Detail View", "Expanded chart view with full history", "Medium"],
        ]}
      />

      <Callout tone="info">
        <Text>
          **Note for the Developer:** Focus on the "Look and Feel". The goal is to impress stakeholders with a dashboard that feels fast, modern, and exactly matches the vision in Figma.
        </Text>
      </Callout>
      
      <Text tone="secondary" size="small">
        Prepared for: Diamond Pigs · May 2026
      </Text>
    </Stack>
  );
}
