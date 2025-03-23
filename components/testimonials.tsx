import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

export function Testimonials() {
  return (
    <section className="py-16 bg-white" id="testimonials">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">What Our Users Say</h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
              Don't just take our word for it. Here's what drivers like you think about ParkMatch.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-500 mb-4">
                "I used to spend 30 minutes looking for parking downtown. With ParkMatch, I find a spot in under 5
                minutes. Game changer!"
              </p>
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-gray-100 w-12 h-12 flex items-center justify-center">
                  <span className="font-bold text-blue-600">JD</span>
                </div>
                <div>
                  <p className="font-medium">John Doe</p>
                  <p className="text-sm text-gray-500">San Francisco, CA</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-500 mb-4">
                "As someone who commutes daily, this app has saved me countless hours and reduced my stress levels
                significantly."
              </p>
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-gray-100 w-12 h-12 flex items-center justify-center">
                  <span className="font-bold text-blue-600">JS</span>
                </div>
                <div>
                  <p className="font-medium">Jane Smith</p>
                  <p className="text-sm text-gray-500">Chicago, IL</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(4)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
                <Star className="h-5 w-5 text-gray-300" />
              </div>
              <p className="text-gray-500 mb-4">
                "The matching algorithm works surprisingly well. I've been able to find parking near my office
                consistently."
              </p>
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-gray-100 w-12 h-12 flex items-center justify-center">
                  <span className="font-bold text-blue-600">RJ</span>
                </div>
                <div>
                  <p className="font-medium">Robert Johnson</p>
                  <p className="text-sm text-gray-500">New York, NY</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

