# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
    config.vm.box = "ubuntu/trusty64"
    config.vm.box_version = "14.04"
    config.vm.network :private_network, ip: "192.168.56.130"
    config.vm.hostname = "dockerlamp-vagrant"

    config.vm.provider :virtualbox do |vb|
        vb.name = "dockerlamp-vagrant"
        vb.customize ["modifyvm", :id, "--memory", "2000" ]
        vb.customize ["modifyvm", :id, "--ostype", "Ubuntu_64" ]
        vb.customize ["modifyvm", :id, "--cpuexecutioncap", "90" ]
        vb.customize ["modifyvm", :id, "--cpus", 2]
        vb.customize ["modifyvm", :id, "--natdnsproxy1", "off"]
    end

    config.vm.provision "shell", privileged: true, inline: <<-shell
        echo "\nVAGRANT ROOT PROVISION SCRIPTS --------------------------------------------\n"
        apt-get update
        # narzedzia dodatkowe dla trybu developerskiego
        apt-get -y install curl git mc htop
        cd /vagrant/provision/vagrant/ && ./create-swap.sh
        # docker
        cd /vagrant/provision/docker && ./install-docker.sh
    shell
    
end
