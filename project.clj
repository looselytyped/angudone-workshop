(defproject
  angudone
  "0.1.0-SNAPSHOT"
  :description
  "FIXME: write description"
  :url
  "http://example.com/FIXME"
  :dependencies
  [[log4j
    "1.2.17"
    :exclusions
    [javax.mail/mail
     javax.jms/jms
     com.sun.jdmk/jmxtools
     com.sun.jmx/jmxri]]
   [com.taoensso/tower "3.0.2"]
   [markdown-clj "0.9.55" :exclusions [com.keminglabs/cljx]]
   [prone "0.6.0"]
   [noir-exception "0.2.2"]
   [com.taoensso/timbre "3.3.1"]
   [com.h2database/h2 "1.4.181"]
   [selmer "0.7.2"]
   [korma "0.4.0"]
   [lib-noir "0.9.4"]
   [org.clojure/clojure "1.6.0"]
   [environ "1.0.0"]
   [ring-server "0.3.1"]
   [im.chit/cronj "1.4.2"]
   [liberator "0.12.2"]
   [cheshire "5.3.1"]]
  :repl-options
  {:init-ns angudone.repl}
  :jvm-opts
  ["-server"]
  :plugins
  [[lein-ring "0.8.13"]
   [lein-environ "1.0.0"]
   [lein-ancient "0.5.5"]
   [cider/cider-nrepl "0.8.1"]]
  :ring
  {:handler angudone.handler/app,
   :init angudone.handler/init,
   :destroy angudone.handler/destroy}
  :profiles
  {:uberjar {:omit-source true, :env {:production true}, :aot :all},
   :production
   {:ring
    {:open-browser? false, :stacktraces? false, :auto-reload? false}},
   :dev
   {:dependencies
    [[ring-mock "0.1.5"]
     [ring/ring-devel "1.3.1"]
     [pjstadig/humane-test-output "0.6.0"]],
    :injections
    [(require 'pjstadig.humane-test-output)
     (pjstadig.humane-test-output/activate!)],
    :env {:dev true}}}
  :min-lein-version "2.0.0")
