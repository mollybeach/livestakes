import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Video, TrendingUp, Users, Trophy } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          LiveStakes 🎥💰
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Real-time prediction markets for hackathon projects
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg">
            <Video className="mr-2 h-4 w-4" />
            Watch Live
          </Button>
          <Button variant="outline" size="lg">
            <TrendingUp className="mr-2 h-4 w-4" />
            View Markets
          </Button>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card>
          <CardHeader>
            <Video className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Live Streaming</CardTitle>
            <CardDescription>
              Watch ETHGlobal hackathon projects in real-time via WebRTC
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <TrendingUp className="h-8 w-8 text-primary mb-2" />
            <CardTitle>AI Predictions</CardTitle>
            <CardDescription>
              Hedera Agent Kit analyzes voice and environment data
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <Users className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Prediction Markets</CardTitle>
            <CardDescription>
              Place on-chain bets with CPMM pricing on Flow blockchain
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <Trophy className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Instant Payouts</CardTitle>
            <CardDescription>
              Automatic settlement when AI makes final decisions
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Stats Section */}
      <div className="bg-muted rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-center">Live Stats</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">12</div>
            <div className="text-sm text-muted-foreground">Active Streams</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">$45.2K</div>
            <div className="text-sm text-muted-foreground">Total Volume</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">1.2K</div>
            <div className="text-sm text-muted-foreground">Active Bettors</div>
          </div>
        </div>
      </div>

      {/* Current Markets */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Current Markets</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Project Alpha {i}</CardTitle>
                    <CardDescription>DeFi Protocol</CardDescription>
                  </div>
                  <Badge variant="secondary">Live</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Yes</span>
                    <span className="font-bold">0.65</span>
                  </div>
                  <div className="flex justify-between">
                    <span>No</span>
                    <span className="font-bold">0.35</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Volume: $12.4K
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
} 