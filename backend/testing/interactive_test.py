"""
Interactive Test Script for Step 2 Features
This script lets you choose which features to test individually.

Usage: python interactive_test.py
"""

import requests
import json
from typing import Dict, List

BASE_URL = "http://localhost:8000/api/v1"
HEADERS = {"Content-Type": "application/json"}

class InteractiveTester:
    def __init__(self):
        self.base_url = BASE_URL
        self.accounts = []
        
    def print_menu(self):
        print("\n" + "="*50)
        print("  STEP 2 FEATURES - INTERACTIVE TESTER")
        print("="*50)
        print("1.  Test Income Separation")
        print("2.  Create Test Accounts")
        print("3.  List All Accounts")
        print("4.  Get Specific Account")
        print("5.  Update Account")
        print("6.  Manual Balance Adjustment")
        print("7.  Transfer Money")
        print("8.  View Account History")
        print("9.  Test Error Scenarios")
        print("10. Run Full Test Suite")
        print("11. Clear Test Data")
        print("0.  Exit")
        print("-"*50)
    
    def safe_request(self, method, url, **kwargs):
        """Make a safe HTTP request with error handling"""
        try:
            response = requests.request(method, url, **kwargs)
            return response
        except requests.exceptions.ConnectionError:
            print("❌ Error: Cannot connect to backend server.")
            print("Make sure your server is running on http://localhost:8000")
            return None
        except Exception as e:
            print(f"❌ Error: {str(e)}")
            return None
    
    def print_response(self, response, title="Response"):
        """Pretty print API response"""
        if response is None:
            return
            
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
        """Test income separation feature"""
        print("\n🔍 Testing Income Separation...")
        
        # Check current transactions
        print("\n1. Current transactions:")
        response = self.safe_request("GET", f"{self.base_url}/table/")
        self.print_response(response, "Current Transactions")
        
        # Separate income
        print("\n2. Separating income...")
        response = self.safe_request("POST", f"{self.base_url}/income/separate")
        self.print_response(response, "Income Separation")
        
        # View income
        print("\n3. Viewing separated income:")
        response = self.safe_request("GET", f"{self.base_url}/income/")
        self.print_response(response, "Income Records")
    
    def create_test_accounts(self):
        """Create test accounts"""
        print("\n💰 Creating Test Accounts...")
        
        test_accounts = [
            {
                "name": "Interactive Test Checking",
                "account_type": "cash",
                "initial_balance": 5000.0
            },
            {
                "name": "Interactive Test Savings",
                "account_type": "investing",
                "initial_balance": 15000.0
            },
            {
                "name": "Interactive Test Credit Card",
                "account_type": "debt",
                "initial_balance": 0.0,
                "associated_methods": '["Test Card", "Interactive Card"]'
            }
        ]
        
        for account_data in test_accounts:
            print(f"\nCreating {account_data['name']}...")
            response = self.safe_request(
                "POST", 
                f"{self.base_url}/accounts/",
                headers=HEADERS,
                json=account_data
            )
            self.print_response(response, f"Created {account_data['name']}")
            
            if response and response.status_code == 200:
                self.accounts.append(response.json())
    
    def list_accounts(self):
        """List all accounts"""
        print("\n📋 Listing All Accounts...")
        response = self.safe_request("GET", f"{self.base_url}/accounts/")
        self.print_response(response, "All Accounts")
        
        # Update our local accounts list
        if response and response.status_code == 200:
            self.accounts = response.json()
    
    def get_specific_account(self):
        """Get a specific account"""
        if not self.accounts:
            self.list_accounts()
        
        if not self.accounts:
            print("No accounts found. Create some accounts first.")
            return
        
        print("\nAvailable accounts:")
        for i, account in enumerate(self.accounts):
            print(f"{i+1}. {account['name']} (ID: {account['id']})")
        
        try:
            choice = int(input("\nEnter account number to view: ")) - 1
            if 0 <= choice < len(self.accounts):
                account_id = self.accounts[choice]['id']
                print(f"\n🔍 Getting account {account_id}...")
                response = self.safe_request("GET", f"{self.base_url}/accounts/{account_id}")
                self.print_response(response, f"Account {account_id}")
            else:
                print("Invalid choice.")
        except ValueError:
            print("Please enter a valid number.")
    
    def update_account(self):
        """Update an account"""
        if not self.accounts:
            self.list_accounts()
        
        if not self.accounts:
            print("No accounts found. Create some accounts first.")
            return
        
        print("\nAvailable accounts:")
        for i, account in enumerate(self.accounts):
            print(f"{i+1}. {account['name']} (ID: {account['id']})")
        
        try:
            choice = int(input("\nEnter account number to update: ")) - 1
            if 0 <= choice < len(self.accounts):
                account = self.accounts[choice]
                account_id = account['id']
                
                new_name = input(f"New name (current: {account['name']}): ").strip()
                new_methods = input("New associated methods (JSON format): ").strip()
                
                update_data = {}
                if new_name:
                    update_data["name"] = new_name
                if new_methods:
                    update_data["associated_methods"] = new_methods
                
                if update_data:
                    print(f"\n✏️ Updating account {account_id}...")
                    response = self.safe_request(
                        "PUT",
                        f"{self.base_url}/accounts/{account_id}",
                        headers=HEADERS,
                        json=update_data
                    )
                    self.print_response(response, "Account Update")
                else:
                    print("No changes made.")
            else:
                print("Invalid choice.")
        except ValueError:
            print("Please enter a valid number.")
    
    def manual_adjustment(self):
        """Make a manual balance adjustment"""
        if not self.accounts:
            self.list_accounts()
        
        if not self.accounts:
            print("No accounts found. Create some accounts first.")
            return
        
        print("\nAvailable accounts:")
        for i, account in enumerate(self.accounts):
            print(f"{i+1}. {account['name']} (Balance: ${account['current_balance']:.2f})")
        
        try:
            choice = int(input("\nEnter account number to adjust: ")) - 1
            if 0 <= choice < len(self.accounts):
                account_id = self.accounts[choice]['id']
                
                amount = float(input("Adjustment amount (+ to add, - to subtract): "))
                description = input("Description: ").strip()
                
                adjustment_data = {
                    "amount": amount,
                    "description": description or "Manual adjustment"
                }
                
                print(f"\n🔧 Adjusting account balance...")
                response = self.safe_request(
                    "POST",
                    f"{self.base_url}/accounts/{account_id}/adjust",
                    headers=HEADERS,
                    json=adjustment_data
                )
                self.print_response(response, "Balance Adjustment")
            else:
                print("Invalid choice.")
        except ValueError:
            print("Please enter valid numbers.")
    
    def transfer_money(self):
        """Transfer money between accounts"""
        if not self.accounts:
            self.list_accounts()
        
        if len(self.accounts) < 2:
            print("Need at least 2 accounts for transfers. Create more accounts first.")
            return
        
        print("\nAvailable accounts:")
        for i, account in enumerate(self.accounts):
            print(f"{i+1}. {account['name']} (Balance: ${account['current_balance']:.2f})")
        
        try:
            from_choice = int(input("\nTransfer FROM account number: ")) - 1
            to_choice = int(input("Transfer TO account number: ")) - 1
            
            if (0 <= from_choice < len(self.accounts) and 
                0 <= to_choice < len(self.accounts) and 
                from_choice != to_choice):
                
                amount = float(input("Transfer amount: "))
                description = input("Description (optional): ").strip()
                
                transfer_data = {
                    "from_account_id": self.accounts[from_choice]['id'],
                    "to_account_id": self.accounts[to_choice]['id'],
                    "amount": amount
                }
                
                if description:
                    transfer_data["description"] = description
                
                print(f"\n🔄 Transferring ${amount:.2f}...")
                response = self.safe_request(
                    "POST",
                    f"{self.base_url}/accounts/transfer",
                    headers=HEADERS,
                    json=transfer_data
                )
                self.print_response(response, "Transfer")
            else:
                print("Invalid account choices.")
        except ValueError:
            print("Please enter valid numbers.")
    
    def view_account_history(self):
        """View account history"""
        if not self.accounts:
            self.list_accounts()
        
        if not self.accounts:
            print("No accounts found. Create some accounts first.")
            return
        
        print("\nAvailable accounts:")
        for i, account in enumerate(self.accounts):
            print(f"{i+1}. {account['name']}")
        
        try:
            choice = int(input("\nEnter account number to view history: ")) - 1
            if 0 <= choice < len(self.accounts):
                account_id = self.accounts[choice]['id']
                account_name = self.accounts[choice]['name']
                
                print(f"\n📊 Getting history for {account_name}...")
                response = self.safe_request("GET", f"{self.base_url}/accounts/{account_id}/history")
                self.print_response(response, f"History for {account_name}")
            else:
                print("Invalid choice.")
        except ValueError:
            print("Please enter a valid number.")
    
    def test_errors(self):
        """Test error scenarios"""
        print("\n❌ Testing Error Scenarios...")
        
        # Non-existent account
        print("\n1. Getting non-existent account...")
        response = self.safe_request("GET", f"{self.base_url}/accounts/99999")
        self.print_response(response, "Non-existent Account")
        
        # Invalid account creation
        print("\n2. Creating invalid account...")
        invalid_data = {
            "name": "",
            "account_type": "invalid",
            "initial_balance": "not_a_number"
        }
        response = self.safe_request(
            "POST",
            f"{self.base_url}/accounts/",
            headers=HEADERS,
            json=invalid_data
        )
        self.print_response(response, "Invalid Account Creation")
        
        # Invalid transfer
        if len(self.accounts) >= 2:
            print("\n3. Invalid transfer (negative amount)...")
            transfer_data = {
                "from_account_id": self.accounts[0]['id'],
                "to_account_id": self.accounts[1]['id'],
                "amount": -100.0
            }
            response = self.safe_request(
                "POST",
                f"{self.base_url}/accounts/transfer",
                headers=HEADERS,
                json=transfer_data
            )
            self.print_response(response, "Invalid Transfer")
    
    def run_full_suite(self):
        """Run the full automated test suite"""
        print("\n🚀 Running Full Test Suite...")
        
        # Import and run the full test
        try:
            from backend.testing.test_step2_features import Step2Tester
            tester = Step2Tester()
            tester.run_all_tests()
        except ImportError:
            print("Full test suite not found. Make sure test_step2_features.py exists.")
    
    def clear_test_data(self):
        """Clear test data (accounts created by this script)"""
        print("\n🧹 This would clear test data...")
        print("Note: Currently no delete endpoint implemented.")
        print("You can manually clear the database if needed.")
    
    def run(self):
        """Run the interactive tester"""
        print("Welcome to the Step 2 Interactive Tester!")
        print("Make sure your backend server is running on http://localhost:8000")
        
        while True:
            self.print_menu()
            
            try:
                choice = input("\nEnter your choice (0-11): ").strip()
                
                if choice == "0":
                    print("Goodbye! 👋")
                    break
                elif choice == "1":
                    self.test_income_separation()
                elif choice == "2":
                    self.create_test_accounts()
                elif choice == "3":
                    self.list_accounts()
                elif choice == "4":
                    self.get_specific_account()
                elif choice == "5":
                    self.update_account()
                elif choice == "6":
                    self.manual_adjustment()
                elif choice == "7":
                    self.transfer_money()
                elif choice == "8":
                    self.view_account_history()
                elif choice == "9":
                    self.test_errors()
                elif choice == "10":
                    self.run_full_suite()
                elif choice == "11":
                    self.clear_test_data()
                else:
                    print("Invalid choice. Please try again.")
                
                input("\nPress Enter to continue...")
                
            except KeyboardInterrupt:
                print("\n\nGoodbye! 👋")
                break
            except Exception as e:
                print(f"Error: {str(e)}")
                input("\nPress Enter to continue...")

if __name__ == "__main__":
    tester = InteractiveTester()
    tester.run() 