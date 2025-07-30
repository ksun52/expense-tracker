"""
Test script for Step 2 features: Income Separation & Account Management
Run this script to test all the implemented functionality.

Usage:
1. Start your backend server: python -m app.main
2. Run this script: python test_step2_features.py
"""

import requests
import json
from datetime import datetime
from typing import Dict, List

# Configuration
BASE_URL = "http://localhost:8000/api/v1"
HEADERS = {"Content-Type": "application/json"}

class Step2Tester:
    def __init__(self):
        self.base_url = BASE_URL
        self.created_accounts = []
        
    def print_section(self, title: str):
        print(f"\n{'='*60}")
        print(f"  {title}")
        print(f"{'='*60}")
    
    def print_response(self, response, title: str = "Response"):
        print(f"\n{title}:")
        print(f"Status: {response.status_code}")
        if response.status_code < 400:
            try:
                data = response.json()
                print(json.dumps(data, indent=2, default=str))
            except:
                print(response.text)
        else:
            print(f"Error: {response.text}")
    
    def test_income_separation(self):
        """Test income separation functionality"""
        self.print_section("TESTING INCOME SEPARATION")
        
        # 1. Get current transactions
        print("1. Getting current transactions...")
        response = requests.get(f"{self.base_url}/table/")
        self.print_response(response, "Current Transactions")
        
        # 2. Separate income from transactions
        print("\n2. Separating income from transactions...")
        response = requests.post(f"{self.base_url}/income/separate")
        self.print_response(response, "Income Separation Result")
        
        # 3. View separated income
        print("\n3. Viewing separated income...")
        response = requests.get(f"{self.base_url}/income/")
        self.print_response(response, "Income Records")
        
        # 4. View income filtered by account
        print("\n4. Viewing income for Checking Account...")
        response = requests.get(f"{self.base_url}/income/?account=Checking Account")
        self.print_response(response, "Checking Account Income")
    
    def test_account_creation(self):
        """Test creating different types of accounts"""
        self.print_section("TESTING ACCOUNT CREATION")
        
        accounts_to_create = [
            {
                "name": "Test Checking Account",
                "account_type": "cash",
                "initial_balance": 5000.0
            },
            {
                "name": "Test Venmo",
                "account_type": "cash", 
                "initial_balance": 250.0
            },
            {
                "name": "Test Apple HYSA",
                "account_type": "investing",
                "initial_balance": 10000.0
            },
            {
                "name": "Test Chase Sapphire",
                "account_type": "debt",
                "initial_balance": 0.0,
                "associated_methods": '["Chase Sapphire", "Chase"]'
            },
            {
                "name": "Test Amex Gold",
                "account_type": "debt",
                "initial_balance": 0.0,
                "associated_methods": '["Amex Gold", "American Express"]'
            }
        ]
        
        for i, account_data in enumerate(accounts_to_create, 1):
            print(f"\n{i}. Creating {account_data['name']}...")
            response = requests.post(
                f"{self.base_url}/accounts/",
                headers=HEADERS,
                json=account_data
            )
            self.print_response(response, f"Created {account_data['name']}")
            
            if response.status_code == 200:
                account = response.json()
                self.created_accounts.append(account)
    
    def test_account_management(self):
        """Test account management operations"""
        self.print_section("TESTING ACCOUNT MANAGEMENT")
        
        # 1. List all accounts
        print("1. Listing all accounts...")
        response = requests.get(f"{self.base_url}/accounts/")
        self.print_response(response, "All Accounts")
        
        if not self.created_accounts:
            print("No accounts created yet. Skipping account management tests.")
            return
        
        test_account = self.created_accounts[0]
        account_id = test_account['id']
        
        # 2. Get specific account
        print(f"\n2. Getting account {account_id}...")
        response = requests.get(f"{self.base_url}/accounts/{account_id}")
        self.print_response(response, f"Account {account_id}")
        
        # 3. Update account details
        print(f"\n3. Updating account {account_id}...")
        update_data = {
            "name": f"Updated {test_account['name']}",
            "associated_methods": '["Updated Method"]'
        }
        response = requests.put(
            f"{self.base_url}/accounts/{account_id}",
            headers=HEADERS,
            json=update_data
        )
        self.print_response(response, "Account Update")
        
        # 4. Manual balance adjustment
        print(f"\n4. Manual balance adjustment for account {account_id}...")
        adjustment_data = {
            "amount": 100.50,
            "description": "Test manual adjustment - found extra cash"
        }
        response = requests.post(
            f"{self.base_url}/accounts/{account_id}/adjust",
            headers=HEADERS,
            json=adjustment_data
        )
        self.print_response(response, "Manual Adjustment")
        
        # 5. Get account history
        print(f"\n5. Getting account history for account {account_id}...")
        response = requests.get(f"{self.base_url}/accounts/{account_id}/history")
        self.print_response(response, "Account History")
    
    def test_transfers(self):
        """Test money transfers between accounts"""
        self.print_section("TESTING ACCOUNT TRANSFERS")
        
        if len(self.created_accounts) < 2:
            print("Need at least 2 accounts for transfer testing. Skipping...")
            return
        
        from_account = self.created_accounts[0]
        to_account = self.created_accounts[1]
        
        print(f"Transferring from {from_account['name']} to {to_account['name']}...")
        
        transfer_data = {
            "from_account_id": from_account['id'],
            "to_account_id": to_account['id'],
            "amount": 500.0,
            "description": "Test transfer between accounts"
        }
        
        response = requests.post(
            f"{self.base_url}/accounts/transfer",
            headers=HEADERS,
            json=transfer_data
        )
        self.print_response(response, "Transfer Result")
        
        # Check balances after transfer
        print(f"\nChecking {from_account['name']} balance after transfer...")
        response = requests.get(f"{self.base_url}/accounts/{from_account['id']}")
        self.print_response(response, "From Account After Transfer")
        
        print(f"\nChecking {to_account['name']} balance after transfer...")
        response = requests.get(f"{self.base_url}/accounts/{to_account['id']}")
        self.print_response(response, "To Account After Transfer")
    
    def test_account_history_detailed(self):
        """Test detailed account history for all accounts"""
        self.print_section("TESTING DETAILED ACCOUNT HISTORY")
        
        for i, account in enumerate(self.created_accounts, 1):
            print(f"\n{i}. History for {account['name']} (ID: {account['id']})...")
            response = requests.get(f"{self.base_url}/accounts/{account['id']}/history")
            self.print_response(response, f"History for {account['name']}")
    
    def test_balance_sync_placeholder(self):
        """Test the balance sync endpoint (currently placeholder)"""
        self.print_section("TESTING BALANCE SYNC (PLACEHOLDER)")
        
        print("Testing balance sync endpoint...")
        response = requests.post(f"{self.base_url}/accounts/sync-balances")
        self.print_response(response, "Balance Sync")
    
    def test_error_scenarios(self):
        """Test error handling scenarios"""
        self.print_section("TESTING ERROR SCENARIOS")
        
        # 1. Try to get non-existent account
        print("1. Getting non-existent account (ID: 99999)...")
        response = requests.get(f"{self.base_url}/accounts/99999")
        self.print_response(response, "Non-existent Account")
        
        # 2. Try to create account with invalid data
        print("\n2. Creating account with invalid data...")
        invalid_data = {
            "name": "",  # Empty name
            "account_type": "invalid_type",
            "initial_balance": "not_a_number"
        }
        response = requests.post(
            f"{self.base_url}/accounts/",
            headers=HEADERS,
            json=invalid_data
        )
        self.print_response(response, "Invalid Account Creation")
        
        # 3. Try to transfer more money than available
        if len(self.created_accounts) >= 2:
            print("\n3. Attempting transfer with insufficient funds...")
            transfer_data = {
                "from_account_id": self.created_accounts[0]['id'],
                "to_account_id": self.created_accounts[1]['id'],
                "amount": 999999.0,  # Way more than available
                "description": "Test insufficient funds"
            }
            response = requests.post(
                f"{self.base_url}/accounts/transfer",
                headers=HEADERS,
                json=transfer_data
            )
            self.print_response(response, "Insufficient Funds Transfer")
        
        # 4. Try to transfer negative amount
        if len(self.created_accounts) >= 2:
            print("\n4. Attempting transfer with negative amount...")
            transfer_data = {
                "from_account_id": self.created_accounts[0]['id'],
                "to_account_id": self.created_accounts[1]['id'],
                "amount": -100.0,
                "description": "Test negative transfer"
            }
            response = requests.post(
                f"{self.base_url}/accounts/transfer",
                headers=HEADERS,
                json=transfer_data
            )
            self.print_response(response, "Negative Amount Transfer")
    
    def test_summary_endpoints(self):
        """Test summary and overview endpoints"""
        self.print_section("TESTING SUMMARY ENDPOINTS")
        
        # Test existing summary endpoint
        print("1. Getting transaction summary...")
        response = requests.get(f"{self.base_url}/summary/")
        self.print_response(response, "Transaction Summary")
        
        # Get all accounts summary
        print("\n2. Getting all accounts summary...")
        response = requests.get(f"{self.base_url}/accounts/")
        self.print_response(response, "All Accounts Summary")
    
    def run_all_tests(self):
        """Run all test scenarios"""
        print("🚀 Starting Step 2 Feature Testing")
        print(f"Backend URL: {self.base_url}")
        
        try:
            # Test each feature group
            self.test_income_separation()
            self.test_account_creation()
            self.test_account_management()
            self.test_transfers()
            self.test_account_history_detailed()
            self.test_balance_sync_placeholder()
            self.test_error_scenarios()
            self.test_summary_endpoints()
            
            print(f"\n{'='*60}")
            print("✅ ALL TESTS COMPLETED!")
            print(f"Created {len(self.created_accounts)} test accounts")
            print("Check your database to see all the changes made.")
            print(f"{'='*60}")
            
        except requests.exceptions.ConnectionError:
            print("❌ ERROR: Could not connect to backend server.")
            print("Make sure your FastAPI server is running on http://localhost:8000")
        except Exception as e:
            print(f"❌ ERROR: {str(e)}")

def main():
    """Run the test suite"""
    tester = Step2Tester()
    tester.run_all_tests()

if __name__ == "__main__":
    main() 