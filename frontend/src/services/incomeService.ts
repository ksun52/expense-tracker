export interface IncomeData {
  id: number;
  notion_id?: string;
  name: string;
  amount: number;
  date_received: string;
  account: string;
  created_at: string;
  updated_at: string;
}

export const fetchIncomeData = async (): Promise<IncomeData[]> => {
  try {
    const response = await fetch('http://localhost:8000/api/v1/income/');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching income data:', error);
    throw error;
  }
};
