import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Leaf, Trophy, Users, Award } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-green-50 to-white">
        <div className="container px-4 md:px-6 space-y-10 xl:space-y-16">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm text-green-800">
                  IEEE Hackathon Project by MOONWALKERS404
                </div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl">
                  Join the <span className="text-green-600">OneEarth</span> Movement
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl">
                  A gamified approach to sustainability. Join challenges, earn rewards, and make a real impact on our planet.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link to="/register">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700">
                    Get Started
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline">
                    Log In
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative h-[350px] w-[350px] md:h-[450px] md:w-[450px] overflow-hidden rounded-xl">
                <img
                  src="https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?q=80&w=1470&auto=format&fit=crop"
                  alt="Earth"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm text-green-800">
                Key Features
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">How OneEarth Works</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                A simple yet powerful platform to drive sustainability challenges and reward eco-friendly actions.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-green-100 p-3">
                <Leaf className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold">Eco Challenges</h3>
              <p className="text-center text-gray-500">
                Join or create sustainability challenges that make a real difference to our planet.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-green-100 p-3">
                <Trophy className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold">XP & Leaderboards</h3>
              <p className="text-center text-gray-500">
                Earn experience points for completed challenges and compete with others on the leaderboard.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-green-100 p-3">
                <Award className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold">Rewards</h3>
              <p className="text-center text-gray-500">
                Unlock exclusive rewards and recognition for your sustainability efforts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-green-50">
        <div className="container px-4 md:px-6 flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Ready to Join?</h2>
            <p className="max-w-[600px] text-gray-500 md:text-xl">
              Create your account today and start making a difference with OneEarth.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Link to="/register">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Sign Up Now
              </Button>
            </Link>
            <Link to="/challenges">
              <Button size="lg" variant="outline">
                Browse Challenges
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}