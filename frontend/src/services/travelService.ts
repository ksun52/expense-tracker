export interface TravelData {
  sub_category: string;
  total: number;
}

export const fetchTravelData = async (): Promise<TravelData[]> => {
  try {
    const response = await fetch('http://localhost:8000/api/v1/travel/');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching travel data:', error);
    throw error;
  }
};
