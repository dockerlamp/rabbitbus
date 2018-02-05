<?php

require_once __DIR__.'/../../vendor/autoload.php';

pcntl_async_signals(true);

// signal handler function
function sig_handler($signo) {
    switch ($signo) {
        case SIGTERM:
        case SIGHUP:
            print "signal '$signo' handled\n";
            exit;
            break;
        default:
    }
}

pcntl_signal(SIGTERM, "sig_handler");
pcntl_signal(SIGHUP,  "sig_handler");

$connection = new \PhpAmqpLib\Connection\AMQPConnection(
    'rabbitmq',
    5672,
    'guest',
    'guest',
    '/',
    false,
    'AMQPLAIN',
    null,
    'en_US',
    10,
    3
);

print "connected\n";
$channel = $connection->channel();
register_shutdown_function(function() use ($channel, $connection) {
    echo "closing rabbit connection\n";
    $channel->close();
    $connection->close();
});

$channel->basic_qos(null, 1, null);

class Consumer {
    private $QUEUE_PREFIX = 'durable';
    private $channel;
    function __construct($channel) {
        $this->channel = $channel;
    }

    private function formatQueueName($command) {
        return "{$this->QUEUE_PREFIX}.{$command}";
    }

    public function addCommandHandler($command, $handler) {
        $callback = function($msg) use ($command, $handler) {
            echo "\t[x] Received {$msg->body}\n";
            try {
                $handler($msg->body);
                $msg->delivery_info['channel']->basic_ack($msg->delivery_info['delivery_tag']);
                echo "\t[x] Acked\n";
            } catch (\Exception $err) {
                $msg->delivery_info['channel']->basic_nack($msg->delivery_info['delivery_tag']);
                echo "\t[x] Nacked\n";
            }
        };
        $this->initializeQueue($command);
        $queueName = $this->formatQueueName($command);
        $this->channel->basic_consume($queueName, '', false, false, false, false, $callback);
        echo "command handler initialized {$command}\n";
    
    }

    private function initializeQueue($command) {
        $queueName = $this->formatQueueName($command);
        $this->channel->queue_declare($queueName, false, true, false, false);
        print "[*] Queue declared {$queueName}\n";
    }    

    public function consume() {
        print "[*] waiting for commands\n";
        while(count($this->channel->callbacks)) {
            $this->channel->wait();
        }
    }
}

$HW2_CMD = 'hello.world.2';
$HW3_CMD = 'hello.world.3';

$consumer = new Consumer($channel);
$consumer->addCommandHandler($HW2_CMD, function($body) {
    echo "\t[x] received command HW2....\n";
});
$consumer->addCommandHandler($HW3_CMD, function($body) {
    echo "\t[x] received command HW3....\n";
});

$consumer->consume();