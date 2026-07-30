import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const SUPABASE_URL = 'https://tdduwxjbxmlzshyjwqxa.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkZHV3eGpieG1senNoeWp3cXhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzOTMzNjksImV4cCI6MjEwMDk2OTM2OX0.-PDHxOFooYpnIinkeq_nviopMjiUZnhYtW2RyKHZM3Q';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function main() {
  const data = JSON.parse(fs.readFileSync('./data_dump3.json', 'utf8'));
  
  const tables = {
    'api.patient': 'api_patient',
    'api.encounter': 'api_encounter',
    'api.claim': 'api_claim',
    'api.campaign': 'api_campaign',
    'api.aiaction': 'api_aiaction',
    'api.auditlog': 'api_auditlog'
  };

  const groupedData = {};
  Object.values(tables).forEach(t => groupedData[t] = []);

  data.forEach(item => {
    const tableName = tables[item.model];
    if (tableName) {
      const row = { id: item.pk, ...item.fields };
      // Django's foreign keys in dumpdata are suffixed differently or directly use the FK name?
      // In Django dump, FK to patient is often 'patient' with value being 'mrn'
      if (row.patient) {
        row.patient_id = row.patient;
        delete row.patient;
      }
      groupedData[tableName].push(row);
    }
  });

  const order = ['api_patient', 'api_encounter', 'api_claim', 'api_campaign', 'api_aiaction', 'api_auditlog'];

  for (const table of order) {
    const rows = groupedData[table];
    if (rows && rows.length > 0) {
      console.log(`Inserting ${rows.length} rows into ${table}...`);
      
      const chunkSize = 500;
      for (let i = 0; i < rows.length; i += chunkSize) {
        const chunk = rows.slice(i, i + chunkSize);
        const { error } = await supabase.from(table).upsert(chunk);
        if (error) {
          console.error(`Error inserting into ${table}:`, error);
        }
      }
      console.log(`Finished ${table}.`);
    }
  }
}

main().catch(console.error);
