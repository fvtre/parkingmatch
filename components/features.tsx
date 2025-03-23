import { Shield, Clock, MapPin, Bell, CreditCard, Users } from "lucide-react"

export function Features() {
  return (
    <section className="py-16 bg-gray-50" id="features">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Key Features</h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
              Everything you need to make parking easier and more efficient.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          <div className="flex flex-col space-y-3 bg-white p-6 rounded-lg shadow-sm">
            <Clock className="h-8 w-8 text-blue-600" />
            <h3 className="text-xl font-bold">Real-Time Matching</h3>
            <p className="text-gray-500">Get matched with drivers in real-time based on location and timing.</p>
          </div>
          <div className="flex flex-col space-y-3 bg-white p-6 rounded-lg shadow-sm">
            <MapPin className="h-8 w-8 text-blue-600" />
            <h3 className="text-xl font-bold">Location Tracking</h3>
            <p className="text-gray-500">Precise location tracking to ensure smooth parking spot exchanges.</p>
          </div>
          <div className="flex flex-col space-y-3 bg-white p-6 rounded-lg shadow-sm">
            <Bell className="h-8 w-8 text-blue-600" />
            <h3 className="text-xl font-bold">Instant Notifications</h3>
            <p className="text-gray-500">
              Get notified immediately when a match is found or when it's time to exchange.
            </p>
          </div>
          <div className="flex flex-col space-y-3 bg-white p-6 rounded-lg shadow-sm">
            <Shield className="h-8 w-8 text-blue-600" />
            <h3 className="text-xl font-bold">Secure Platform</h3>
            <p className="text-gray-500">Your data is protected with industry-standard security measures.</p>
          </div>
          <div className="flex flex-col space-y-3 bg-white p-6 rounded-lg shadow-sm">
            <CreditCard className="h-8 w-8 text-blue-600" />
            <h3 className="text-xl font-bold">Easy Payments</h3>
            <p className="text-gray-500">Seamless payment processing for premium features and services.</p>
          </div>
          <div className="flex flex-col space-y-3 bg-white p-6 rounded-lg shadow-sm">
            <Users className="h-8 w-8 text-blue-600" />
            <h3 className="text-xl font-bold">User Ratings</h3>
            <p className="text-gray-500">Rate your experience to help build a trusted community of drivers.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

