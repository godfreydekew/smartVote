import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Info, Clock, ArrowUpRight, ArrowDownLeft, FileText, Users, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BlockchainLogsProps {
  contractAddress: string;
  network: string;
}

interface Transaction {
  hash: string;
  from: string;
  timestamp: string;
  gasUsed: string;
  status: 'success' | 'failed';
  value: string;
  method: string;
  blockNumber: number;
}

interface ContractInfo {
  balance: string;
  deployedBy: string;
  createdAt: string;
  totalTransactions: number;
}

interface EtherscanTransaction {
  hash: string;
  from: string;
  timeStamp: string;
  gasUsed: string;   
  isError: string;   
  value: string;     
  input: string;
  blockNumber: string; 
}

export const BlockchainLogs: React.FC<BlockchainLogsProps> = ({
  contractAddress,
  network,
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [contractInfo, setContractInfo] = useState<ContractInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const etherscanApiKey = import.meta.env.VITE_ETHERSCAN_KEY;
  const baseUrl = network === 'sepolia' 
    ? 'https://api-sepolia.etherscan.io/api'
    : 'https://api.etherscan.io/api';

  useEffect(() => {
    const fetchContractData = async () => {
      try {
        setLoading(true);
        
        // Fetch contract balance
        const balanceResponse = await fetch(
          `${baseUrl}?module=account&action=balance&address=${contractAddress}&tag=latest&apikey=${etherscanApiKey}`
        );
        const balanceData = await balanceResponse.json();
        
        // Fetch contract transactions
        const txResponse = await fetch(
          `${baseUrl}?module=account&action=txlist&address=${contractAddress}&startblock=0&endblock=99999999&sort=desc&apikey=${etherscanApiKey}`
        );
        const txData = await txResponse.json();

        if (txData.status === '1' && txData.result) {
          const formattedTransactions = txData.result.map((tx: EtherscanTransaction) => ({
            hash: tx.hash,
            from: tx.from,
            timestamp: new Date(parseInt(tx.timeStamp) * 1000).toLocaleString(),
            gasUsed: `${(parseInt(tx.gasUsed) * 1e-9).toFixed(6)} ETH`,
            status: tx.isError === '0' ? 'success' : 'failed',
            value: `${(parseInt(tx.value) * 1e-18).toFixed(6)} ETH`,
            method: tx.input.slice(0, 10) === '0x' ? 'Transfer' : 'Contract Interaction',
            blockNumber: parseInt(tx.blockNumber)
          }));

          setTransactions(formattedTransactions);
        }

        // Set contract info
        setContractInfo({
          balance: `${(parseInt(balanceData.result) * 1e-18).toFixed(6)} ETH`,
          deployedBy: txData.result[0]?.from || 'Unknown',
          createdAt: new Date(parseInt(txData.result[0]?.timeStamp || '0') * 1000).toLocaleDateString(),
          totalTransactions: txData.result.length
        });

      } catch (err) {
        setError('Failed to fetch blockchain data');
        console.error('Error fetching blockchain data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (contractAddress && etherscanApiKey) {
      fetchContractData();
    }
  }, [contractAddress, network, etherscanApiKey]);

  const getEtherscanUrl = () => {
    const explorerUrl = network === 'sepolia' 
      ? 'https://sepolia.etherscan.io'
      : 'https://etherscan.io';
    return `${explorerUrl}/address/${contractAddress}`;
  };

  const getTransactionUrl = (hash: string) => {
    const explorerUrl = network === 'sepolia'
      ? 'https://sepolia.etherscan.io'
      : 'https://etherscan.io';
    return `${explorerUrl}/tx/${hash}`;
  };

  const getMethodColor = (method: string) => {
    if (method === 'Transfer') return 'bg-green-100 text-green-700';
    return 'bg-blue-100 text-blue-700';
  };

  if (loading) {
    return (
      <Card className="mt-8">
        <CardContent className="p-6 text-center">
          <div className="animate-pulse">Loading blockchain data...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mt-8">
        <CardContent className="p-6 text-center text-red-500">
          {error}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-8">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Blockchain Information</CardTitle>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">Detailed contract metadata and transaction history from Etherscan.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button variant="outline" size="sm" asChild>
            <a href={getEtherscanUrl()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              <span>View on Etherscan</span>
            </a>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 text-sm text-gray-700">
        {/* Contract Overview */}
        {contractInfo && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Wallet className="h-5 w-5 text-gray-400" />
              <div>
                <div className="text-gray-500">Contract Balance</div>
                <div className="font-medium">{contractInfo.balance}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-gray-400" />
              <div>
                <div className="text-gray-500">Deployed</div>
                <div className="font-medium">{contractInfo.createdAt}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-gray-400" />
              <div>
                <div className="text-gray-500">Total Transactions</div>
                <div className="font-medium">{contractInfo.totalTransactions}</div>
              </div>
            </div>
          </div>
        )}

        {/* Contract Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-gray-500 font-medium mb-2">Contract Address</h4>
            <div className="flex items-center gap-2">
              <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                {contractAddress}
              </code>
              <Button variant="ghost" size="sm" asChild>
                <a href={getEtherscanUrl()} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
          <div>
            <h4 className="text-gray-500 font-medium mb-2">Network</h4>
            <Badge variant="outline" className="capitalize">{network}</Badge>
          </div>
        </div>

        {/* Transaction History */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-gray-500 font-medium">Transaction History</h4>
            <Button variant="outline" size="sm" asChild>
              <a href={getEtherscanUrl()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                <span>View All on Etherscan</span>
              </a>
            </Button>
          </div>
          <ScrollArea className="h-[400px] rounded-md border">
            <div className="p-4">
              <table className="w-full">
                <thead className="sticky top-0 bg-white border-b">
                  <tr>
                    <th className="text-left p-2 text-xs font-medium text-gray-500">Status</th>
                    <th className="text-left p-2 text-xs font-medium text-gray-500">Method</th>
                    <th className="text-left p-2 text-xs font-medium text-gray-500">From</th>
                    <th className="text-left p-2 text-xs font-medium text-gray-500">Time</th>
                    <th className="text-left p-2 text-xs font-medium text-gray-500">Block</th>
                    <th className="text-left p-2 text-xs font-medium text-gray-500">Gas</th>
                    <th className="text-left p-2 text-xs font-medium text-gray-500">Transaction</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx, i) => (
                    <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="p-2">
                        <Badge variant={tx.status === 'success' ? 'default' : 'destructive'} className="text-xs">
                          {tx.status}
                        </Badge>
                      </td>
                      <td className="p-2">
                        <Badge variant="outline" className={`text-xs ${getMethodColor(tx.method)}`}>
                          {tx.method}
                        </Badge>
                      </td>
                      <td className="p-2">
                        <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                          {tx.from.slice(0, 8)}...{tx.from.slice(-6)}
                        </code>
                      </td>
                      <td className="p-2 text-xs text-gray-500">
                        {tx.timestamp}
                      </td>
                      <td className="p-2 text-xs text-gray-500">
                        #{tx.blockNumber}
                      </td>
                      <td className="p-2 text-xs text-gray-500">
                        {tx.gasUsed}
                      </td>
                      <td className="p-2">
                        <Button variant="ghost" size="sm" asChild className="h-6">
                          <a href={getTransactionUrl(tx.hash)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                            <span className="text-xs font-mono">{tx.hash.slice(0, 8)}...{tx.hash.slice(-6)}</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};
 