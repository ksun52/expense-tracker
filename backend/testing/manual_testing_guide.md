# Manual Testing Guide for Step 2 Features

This guide provides manual testing commands and examples for all Step 2 functionality.

## Prerequisites

1. Start your backend server:
   ```bash
   cd backend
   python -m app.main
   ```

2. Server should be running on `http://localhost:8000`
3. API documentation available at `http://localhost:8000/docs`

---

## 🔍 1. Income Separation Features

### View Current Transactions
```bash
curl -X GET "http://localhost:8000/api/v1/table/" \
  -H "accept: application/json"
```

### Separate Income from Transactions
```bash
curl -X POST "http://localhost:8000/api/v1/income/separate" \
  -H "accept: application/json"
```

### View All Income Records
```bash
curl -X GET "http://localhost:8000/api/v1/income/" \
  -H "accept: application/json"
```

### View Income by Account
```bash
curl -X GET "http://localhost:8000/api/v1/income/?account=Checking%20Account" \
  -H "accept: application/json"
```

---

## 💰 2. Account Management Features

### Create Cash Account (Checking)
```bash
curl -X POST "http://localhost:8000/api/v1/accounts/" \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Checking Account",
    "account_type": "cash",
    "initial_balance": 5000.0
  }'
```

### Create Cash Account (Venmo)
```bash
curl -X POST "http://localhost:8000/api/v1/accounts/" \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Venmo",
    "account_type": "cash",
    "initial_balance": 250.0
  }'
```

### Create Investing Account
```bash
curl -X POST "http://localhost:8000/api/v1/accounts/" \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Apple HYSA",
    "account_type": "investing",
    "initial_balance": 15000.0
  }'
```

### Create Debt Account (Credit Card)
```bash
curl -X POST "http://localhost:8000/api/v1/accounts/" \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Chase Sapphire Card",
    "account_type": "debt",
    "initial_balance": 0.0,
    "associated_methods": "[\"Chase Sapphire\", \"Chase\", \"Chase Credit\"]"
  }'
```

### List All Accounts
```bash
curl -X GET "http://localhost:8000/api/v1/accounts/" \
  -H "accept: application/json"
```

### Get Specific Account (replace {id} with actual account ID)
```bash
curl -X GET "http://localhost:8000/api/v1/accounts/1" \
  -H "accept: application/json"
```

### Update Account Details
```bash
curl -X PUT "http://localhost:8000/api/v1/accounts/1" \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Account Name",
    "associated_methods": "[\"New Method\", \"Another Method\"]"
  }'
```

---

## 🔧 3. Balance Management Features

### Manual Balance Adjustment
```bash
curl -X POST "http://localhost:8000/api/v1/accounts/1/adjust" \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 150.75,
    "description": "Found extra cash in wallet - manual adjustment"
  }'
```

### Negative Manual Adjustment (for corrections)
```bash
curl -X POST "http://localhost:8000/api/v1/accounts/1/adjust" \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": -50.25,
    "description": "Correction: removed duplicate entry"
  }'
```

---

## 🔄 4. Transfer Features

### Transfer Money Between Accounts
```bash
curl -X POST "http://localhost:8000/api/v1/accounts/transfer" \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "from_account_id": 1,
    "to_account_id": 2,
    "amount": 500.0,
    "description": "Transfer for monthly savings"
  }'
```

### Transfer Without Description
```bash
curl -X POST "http://localhost:8000/api/v1/accounts/transfer" \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "from_account_id": 2,
    "to_account_id": 3,
    "amount": 1000.0
  }'
```

---

## 📊 5. History and Tracking Features

### Get Account History
```bash
curl -X GET "http://localhost:8000/api/v1/accounts/1/history" \
  -H "accept: application/json"
```

### Balance Sync (Placeholder)
```bash
curl -X POST "http://localhost:8000/api/v1/accounts/sync-balances" \
  -H "accept: application/json"
```

---

## 📈 6. Summary and Overview Features

### Transaction Summary
```bash
curl -X GET "http://localhost:8000/api/v1/summary/" \
  -H "accept: application/json"
```

### Sync Transactions from Notion
```bash
curl -X GET "http://localhost:8000/api/v1/sync/" \
  -H "accept: application/json"
```

---

## ❌ 7. Error Testing Scenarios

### Try to Get Non-existent Account
```bash
curl -X GET "http://localhost:8000/api/v1/accounts/99999" \
  -H "accept: application/json"
```

### Try Invalid Account Creation
```bash
curl -X POST "http://localhost:8000/api/v1/accounts/" \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "",
    "account_type": "invalid_type",
    "initial_balance": "not_a_number"
  }'
```

### Try Transfer with Insufficient Funds
```bash
curl -X POST "http://localhost:8000/api/v1/accounts/transfer" \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "from_account_id": 1,
    "to_account_id": 2,
    "amount": 999999.0,
    "description": "This should fail - insufficient funds"
  }'
```

### Try Transfer with Negative Amount
```bash
curl -X POST "http://localhost:8000/api/v1/accounts/transfer" \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "from_account_id": 1,
    "to_account_id": 2,
    "amount": -100.0,
    "description": "This should fail - negative amount"
  }'
```

---

## 🧪 8. Testing Workflow Example

Here's a complete testing workflow you can follow:

1. **Setup**: Create some accounts
2. **Income**: Separate income from transactions
3. **Operations**: Do some transfers and adjustments
4. **Verification**: Check histories and balances

### Complete Example Workflow:

```bash
# 1. Create checking account
curl -X POST "http://localhost:8000/api/v1/accounts/" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Checking", "account_type": "cash", "initial_balance": 3000.0}'

# 2. Create savings account  
curl -X POST "http://localhost:8000/api/v1/accounts/" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Savings", "account_type": "investing", "initial_balance": 10000.0}'

# 3. Separate income
curl -X POST "http://localhost:8000/api/v1/income/separate"

# 4. Transfer money
curl -X POST "http://localhost:8000/api/v1/accounts/transfer" \
  -H "Content-Type: application/json" \
  -d '{"from_account_id": 1, "to_account_id": 2, "amount": 500.0, "description": "Monthly savings"}'

# 5. Manual adjustment
curl -X POST "http://localhost:8000/api/v1/accounts/1/adjust" \
  -H "Content-Type: application/json" \
  -d '{"amount": 100.0, "description": "Found cash"}'

# 6. Check final balances
curl -X GET "http://localhost:8000/api/v1/accounts/"

# 7. Check history
curl -X GET "http://localhost:8000/api/v1/accounts/1/history"
```

---

## 💡 Tips for Manual Testing

1. **Use the FastAPI Docs**: Visit `http://localhost:8000/docs` for interactive testing
2. **Check Database**: Look at your SQLite database to see the changes
3. **Test Edge Cases**: Try invalid inputs to test error handling
4. **Watch Balances**: Monitor how balances change with each operation
5. **History Tracking**: Verify that all operations are recorded in account history

---

## 🔍 What to Look For

When testing, pay attention to:

- ✅ **Balance Updates**: Do balances change correctly?
- ✅ **History Records**: Is every change tracked?
- ✅ **Error Handling**: Do invalid requests return proper errors?
- ✅ **Data Persistence**: Are changes saved to the database?
- ✅ **Account Types**: Do different account types behave correctly?
- ✅ **Transfer Logic**: Do transfers update both accounts properly?

Happy testing! 🚀 