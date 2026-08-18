export interface QueryRequest {
  session_id: string;
  message: string;
}

export interface QueryResponse {
  status: 'success' | 'error';
  response: string;
  rows: Array<Record<string, any>> | null;
  error: string | null;
}

const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://nlqt-service.onrender.com/query';

/**
 * Sends a query message to the NLQT backend service
 */
export async function sendQuery(requestData: QueryRequest): Promise<QueryResponse> {
  try {
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data: QueryResponse = await response.json();
    return data;
  } catch (error) {
    console.error('API Error in sendQuery:', error);
    return {
      status: 'error',
      response: 'I encountered a connection issue while reaching my brain server. Please verify your connection or try again shortly.',
      rows: null,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
